import { Profile } from "../entities/Profile"
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql"
import { MyContext } from "../types"
import { isAuth } from "../middleware/isAuth"

@InputType()
class ProfileInput {  
    @Field()
    title: string      
    @Field()
    firstname: string    
    @Field()
    lastname: string
    @Field()
    dob: string 
}

@Resolver()
export class ProfileResolver {
    @Query(() => [Profile])
        async profiles(): Promise<Profile[]> {
            return await Profile.find()
        }

    @Query(() => Profile, { nullable: true })
        profile(@Arg("id") id: number): Promise<Profile | undefined> {
            return Profile.findOne(id)
        }

    @Mutation(() => Profile)
        @UseMiddleware(isAuth)
        async createProfile(
            @Arg("input") input: ProfileInput,
            @Ctx() { req }: MyContext
            ): Promise<Profile> {
            //can create posts only if user logged in
                      
            return Profile.create({ 
                ...input,
                creatorId: req.session.userId,
            }).save()
        }

    @Mutation(() => Profile) 
        async updateProfile(
            @Arg("id") id: number,
            @Arg("firstname", () => String, { nullable: true }) firstname: string
            ): Promise<Profile | null> {
            const profile = await Profile.findOne(id)
            if(!profile) {
                return null
            }
            if(typeof firstname !== "undefined") {
                await Profile.update({ id }, { firstname })
            }
            return profile
        }

    @Mutation(() => Boolean) 
        async deleteProfile(
            @Arg("id") id: number): Promise<boolean> {
            try {
                await Profile.delete(id)
                return true
            }catch(error){
                return false
            }
            
        }

}