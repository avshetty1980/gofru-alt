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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileResolver = void 0;
const Profile_1 = require("../entities/Profile");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const typeorm_1 = require("typeorm");
let ProfileInput = class ProfileInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ProfileInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ProfileInput.prototype, "firstname", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ProfileInput.prototype, "lastname", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ProfileInput.prototype, "dob", void 0);
ProfileInput = __decorate([
    type_graphql_1.InputType()
], ProfileInput);
let ProfileResolver = class ProfileResolver {
    async profiles(limit, cursor) {
        const realLimit = Math.min(50, limit);
        const qb = typeorm_1.getConnection()
            .getRepository(Profile_1.Profile)
            .createQueryBuilder("profileQuery")
            .orderBy('"createdAt"', "DESC")
            .take(realLimit);
        if (cursor) {
            qb.where('"createdAt" < :cursor', {
                cursor: new Date(parseInt(cursor))
            });
        }
        return qb.getMany();
    }
    profile(id) {
        return Profile_1.Profile.findOne(id);
    }
    async createProfile(input, { req }) {
        return Profile_1.Profile.create({
            ...input,
            creatorId: req.session.userId,
        }).save();
    }
    async updateProfile(id, firstname) {
        const profile = await Profile_1.Profile.findOne(id);
        if (!profile) {
            return null;
        }
        if (typeof firstname !== "undefined") {
            await Profile_1.Profile.update({ id }, { firstname });
        }
        return profile;
    }
    async deleteProfile(id) {
        try {
            await Profile_1.Profile.delete(id);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
__decorate([
    type_graphql_1.Query(() => [Profile_1.Profile]),
    __param(0, type_graphql_1.Arg("limit", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("cursor", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "profiles", null);
__decorate([
    type_graphql_1.Query(() => Profile_1.Profile, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "profile", null);
__decorate([
    type_graphql_1.Mutation(() => Profile_1.Profile),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProfileInput, Object]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "createProfile", null);
__decorate([
    type_graphql_1.Mutation(() => Profile_1.Profile),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("firstname", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "updateProfile", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "deleteProfile", null);
ProfileResolver = __decorate([
    type_graphql_1.Resolver()
], ProfileResolver);
exports.ProfileResolver = ProfileResolver;
//# sourceMappingURL=profile.js.map