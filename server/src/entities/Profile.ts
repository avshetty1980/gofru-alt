import { Field, ObjectType } from "type-graphql";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne
    } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Profile extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    title!: string

    @Field()
    @Column()
    firstname!: string
    
    @Field()
    @Column()
    lastname!: string

    @Field()
    @Column()
    dob!: string

    @Field()
    @Column({ type: "int", default: 0 })
    points!: number

    @Field()
    @Column()
    creatorId: number

    @ManyToOne(() => User, user => user.profiles)
    creator: User

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date

}