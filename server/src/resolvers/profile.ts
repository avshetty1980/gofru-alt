import { Profile } from "../entities/Profile"
import { Arg, Mutation, Query, Resolver } from "type-graphql"


@Resolver()
export class ProfileResolver {
    @Query(() => [Profile])
        profiles(): Promise<Profile[]> {
            return Profile.find()
        }

    @Query(() => Profile, { nullable: true })
        profile(@Arg("id") id: number): Promise<Profile | undefined> {
            return Profile.findOne(id)
        }

    @Mutation(() => Profile)
        async createProfile(@Arg("name") name: string): Promise<Profile> {
            return Profile.create({ name }).save()
        }

    @Mutation(() => Profile) 
        async updateProfile(
            @Arg("id") id: number,
            @Arg("name", () => String, { nullable: true }) name: string
            ): Promise<Profile | null> {
            const profile = await Profile.findOne({ id })
            if(!profile) {
                return null
            }
            if(typeof name !== "undefined") {
                await Profile.update({ id }, { name })
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