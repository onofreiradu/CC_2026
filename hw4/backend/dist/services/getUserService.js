"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserService = getUserService;
const db_1 = require("../db/db");
async function getUserService(userId) {
    const result = await db_1.db.query(`
      SELECT id, username, email, full_name, birth_date, phone_number, profile_picture_url, created_at, updated_at
      FROM users
      WHERE id = $1
    `, [userId]);
    return result.rows[0] ?? null;
}
