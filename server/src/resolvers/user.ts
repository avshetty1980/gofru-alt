import { User } from "../entities/User";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { UsernamePasswordInput } from "./usernamePasswordInput";
import argon2 from "argon2"
import { MyContext } from "../types";

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

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {

    console.log("session:", req.session)
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOne({ id: req.session.userId });
    return user;
  }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {

        if(options.username.length < 5) {
            return {
                errors: [{
                    field: "username",
                    message: "Username must have 6 or more characters"
                }]
                
            }
        }

        if(options.password.length < 5) {
            return {
                errors: [{
                    field: "password",
                    message: "Password must have 6 or more characters"
                }]
                
            }
        }

        const hashedPassword = await argon2.hash(options.password)
        
        try {

            const user = await User.create({
            email: options.email,
            username: options.username,
            password: hashedPassword
            }).save() 

        } catch(error) {
            //|| err.detail.includes("already exists")) {
            //duplicate username error
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
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse>  {
        const user = await User.findOne({username: options.username})
        if(!user) {
            return {
                errors: [{
                    field: "username",
                    message: "That username does not exist",
                 }]
            }
        }
        const valid = await argon2.verify(user.password, options.password)

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

}