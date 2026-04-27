"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = loginService;
const db_1 = require("../db/db");
const hashPassword_1 = require("../utils/hashPassword");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
async function loginService(email, password) {
    const result = await db_1.db.query('SELECT id, username, email, password FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
    }
    const user = result.rows[0];
    if (!(0, hashPassword_1.verifyPassword)(password, user.password)) {
        throw new Error('Invalid credentials');
    }
    const expiresIn = config_1.config.auth.jwtExpiresIn;
    return jsonwebtoken_1.default.sign({
        sub: user.id,
        userId: user.id,
        username: user.username,
        email: user.email,
    }, config_1.config.auth.jwtSecret, { expiresIn });
}
exports.default = loginService;
