"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const usernamePasswordInput_1 = require("./usernamePasswordInput");
const argon2_1 = __importDefault(require("argon2"));
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserResolver = class UserResolver {
    async me({ req }) {
        console.log("session:", req.session);
        if (!req.session.userId) {
            return null;
        }
        const user = await User_1.User.findOne({ id: req.session.userId });
        return user;
    }
    async register(options, { req }) {
        if (options.username.length < 5) {
            return {
                errors: [{
                        field: "username",
                        message: "Username must have 6 or more characters"
                    }]
            };
        }
        if (options.password.length < 5) {
            return {
                errors: [{
                        field: "password",
                        message: "Password must have 6 or more characters"
                    }]
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        try {
            const user = await User_1.User.create({
                email: options.email,
                username: options.username,
                password: hashedPassword
            }).save();
        }
        catch (error) {
            if (error.code === "23505") {
                return {
                    errors: [{
                            field: "username",
                            message: "Username already taken"
                        }]
                };
            }
            console.log("message:", error.message);
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }
    async login(options, { req }) {
        const user = await User_1.User.findOne({ username: options.username });
        if (!user) {
            return {
                errors: [{
                        field: "username",
                        message: "That username does not exist",
                    }]
            };
        }
        const valid = await argon2_1.default.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [{
                        field: "password",
                        message: "Password is incorrect",
                    }]
            };
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usernamePasswordInput_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usernamePasswordInput_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map