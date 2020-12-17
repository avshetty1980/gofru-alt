import { User } from "../entities/User";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { UsernamePasswordInput } from "./usernamePasswordInput";
import argon2 from "argon2"
import { getConnection } from "typeorm"
import { MyContext } from "../types";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
require('dotenv').config()
import {v4} from "uuid"
import { COOKIE_NAME } from "../constants";

@ObjectType()
class FieldError {
    @Field()
    field: string

    @Field()
    message: string
}

@ObjectType()
class UserResponse {

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { redis, req }: MyContext
    ): Promise<UserResponse> {
        if(newPassword.length < 5) {
            return { errors: [
                {
                    field: "newPassword",
                    message: "Password must have 6 or more characters"
                },
                ]
                
            }
        }

        const key = process.env.FORGOT_PASSWORD_PREFIX + token
        const userId = await redis.get(key)
        if(!userId){
            //assume token exists and user did not tamper 
            return {
               errors: [
                {
                    field: "token",
                    message: "Token expired"
                },
                ]
            } 
        }
        //at this stage, know that token is valid and know the user
        const userIdNum = parseInt(userId)
        const user = await User.findOne(userIdNum)

        if(!user) {
             return {
                //user associated with token has been deleted
               errors: [
                {
                    field: "token",
                    message: "User no longer exists"
                },
                ]
            }
        }

        await User.update(
            { id: userIdNum },
            {
                password: await argon2.hash(newPassword)
            }
        )

        //remove from redis so cannot re-use token to change password
        await redis.del(key)

        //log in user after change password
            req.session.userId = user.id

        return { user }
        
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { redis } : MyContext
    ) {
        //search with email which is not primary key
        const user = await User.findOne({ where: { email }})
        if(!user) {
            //email is not in db
            //do nothing if no user found in db
            return true
        }

        //generate token
        const token = v4()

        //store token in redis, lookup value and then get user.id
        await redis.set(
            process.env.FORGOT_PASSWORD_PREFIX + token,
            user.id,
            "ex",
            1000 * 60 * 60 * 24 * 3
        ) //3 days

        //when user changes password browser sends back token
        await sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
        )

        return true
    }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {

    console.log("session:", req.session)
    // you are not logged in
    if (!req.session.userId) {
      return null
    }
    //returns promise of User
    return User.findOne({ id: req.session.userId })
    
  }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options)
        if(errors){
            return { errors }
        }
       
        const hashedPassword = await argon2.hash(options.password)
        let user
        try {
            // User.create({
            //     email: options.email,
            //     username: options.username,
            //     password: hashedPassword
            // }).save()
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    email: options.email,
                    username: options.username,
                    password: hashedPassword
                })
                .returning("*") 
                .execute()
            user = result.raw[0]
        } catch(error) {
            //|| err.detail.includes("already exists")) {
            //duplicate username error
            console.log(error)
            if(error.code === "23505") {
                return {
                    errors: [{
                        field: "username",
                        message: "Username already taken"
                    }]
                }
            }
            console.log("message:", error.message)
        }
           
      // store user id session
    // this will set a cookie on the user
    // keep them logged in after registering
    req.session!.userId = user.id;
        
        return {
            user,
        }
    }
    
     @Mutation(() => UserResponse)
    async login(
        //@Arg("options") options: UsernamePasswordInput,
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse>  {
        //const user = await User.findOne({ username: options.username })
        const user = await User.findOne(
            usernameOrEmail.includes("@")
            ? { where: { email: usernameOrEmail} }
            : { where: { username: usernameOrEmail} }
        )

        if(!user) {
            return {
                errors: [{
                    field: "usernameOrEmail",
                    message: "That username does not exist",
                 }]
            }
        }
        //const valid = await argon2.verify(user.password, options.password)
        const valid = await argon2.verify(user.password, password)

        if(!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "Password is incorrect",
                 }]
            }            
        }
        
        //storing userid in session to know who user is
        req.session!.userId = user.id
        

        return {
            user,
        }       
        
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res }: MyContext
    ) {
        
        return new Promise((resolve) => req.session.destroy(error => {
            
            if(error) {
                console.log(error)
                resolve(false)                
                return
            }
            // res.clearCookie(process.env.COOKIE_NAME)
            res.clearCookie(COOKIE_NAME)
            resolve(true)
        }))
    }

}