"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (!options.email.includes("@")) {
        return [
            {
                field: "email",
                message: "Invalid email address"
            },
        ];
    }
    if (options.username.length < 5) {
        return [
            {
                field: "username",
                message: "Username must have 6 or more characters"
            },
        ];
    }
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "Username cannot include @"
            },
        ];
    }
    if (options.password.length < 5) {
        return [
            {
                field: "password",
                message: "Password must have 6 or more characters"
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map