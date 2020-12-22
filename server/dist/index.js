"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const ioredis_1 = __importDefault(require("ioredis"));
const Profile_1 = require("./entities/Profile");
const hello_1 = require("./resolvers/hello");
const profile_1 = require("./resolvers/profile");
const User_1 = require("./entities/User");
const user_1 = require("./resolvers/user");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const constants_1 = require("./constants");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const main = async () => {
    const conn = await typeorm_1.createConnection({
        type: "postgres",
        host: "localhost",
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASS,
        database: "gofru",
        synchronize: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        logging: true,
        entities: [Profile_1.Profile, User_1.User]
    });
    await conn.runMigrations();
    const app = express_1.default();
    const RedisStore = connect_redis_1.default(express_session_1.default);
    const redis = new ioredis_1.default();
    app.use(cors_1.default({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTTL: true,
            disableTouch: true
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        },
        saveUninitialized: false,
        secret: "hgukfuglkmhfdtstcgbibjh",
        resave: false,
    }));
    const schema = await type_graphql_1.buildSchema({
        resolvers: [hello_1.HelloResolver, profile_1.ProfileResolver, user_1.UserResolver],
        validate: false,
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        introspection: true,
        playground: true,
        context: ({ req, res }) => ({ req, res, redis }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(4000, () => {
        console.log("server started on localhost:4000/graphql");
    });
};
main().catch(err => {
    console.error(err);
});
//# sourceMappingURL=index.js.map