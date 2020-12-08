import "reflect-metadata"
import  { createConnection } from "typeorm"
require('dotenv').config()
import express from "express"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { Profile } from "./entities/Profile"
import { HelloResolver } from "./resolvers/hello"
import { ProfileResolver } from "./resolvers/profile"
import { User } from "./entities/User"
import { UserResolver } from "./resolvers/user"
import redis from 'redis'
import session from 'express-session'
import connectRedis from "connect-redis"
import { __prod__ } from "./constants"
import cors from "cors"

const main = async () => {
    
    await createConnection ({
        type: "postgres",
        host: "localhost",
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASS,
        database: "gofru",
        synchronize: true,
        logging: true,
        entities: [Profile, User]         
        
    }).then(async conn => {
        await conn.runMigrations()
    })

    const app = express()    

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    //apply cors middleware to all routes
    app.use(cors({
       // "/routeName",
        origin: "http://localhost:3000",
        credentials: true,
    }))
    
    app.use(
        session({
            name: process.env.COOKIE_NAME,
            store: new RedisStore({
                client: redisClient,
                disableTTL: true,
                disableTouch: true
                }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
                httpOnly: true, //cannot access in JS frontend
                sameSite: "lax", //csrf
                secure: false, //__prod__...cookie only works in https
            },
            saveUninitialized: false, 
            secret: "hgukfuglkmhfdtstcgbibjh",
            resave: false,
        })
    )
      
    // app.use(
    //     session({
    //         name: "cid",
    //         store: new RedisStore({
    //             client: redisClient,
    //             disableTouch: true
    //             }),
    //         cookie: {
    //             maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
    //             httpOnly: true, //cannot access in JS frontend
    //             sameSite: "lax", //csrf
    //             secure: __prod__, //cookie only works in https
    //         },
    //         saveUninitialized: false, 
    //         secret: "hgukfuglkmhfdtstcgbibjh",
    //         resave: false,
    //     })
    // )

    const schema = await buildSchema({
        resolvers: [HelloResolver, ProfileResolver, UserResolver],
        validate: false,
    })

    const apolloServer = new ApolloServer({ 
            schema,                    
            introspection: true,
            playground: true,
            context: ({ req, res }) => ({ req, res }),
            })    

    apolloServer.applyMiddleware({ 
                    app,
                    cors: false,
                })


    // app.get("/", (_, res) => {
    //     res.send("Hello Akshay")
    // })

    app.listen(4000, () => {
        console.log("server started on localhost:4000/graphql")
    })

    // try {        
    //         // return  await Profile.create({ name: "Dylan Shetty"}).save()            
    //         // const posts =  await Profile.find({})
    //         // console.log(posts)
        

    // }catch(error) {
    //     console.log("error", error)
    // }      

}

main().catch (err => {
    console.error(err)
}) 