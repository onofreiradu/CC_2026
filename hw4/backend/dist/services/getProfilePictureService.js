"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfilePictureService = getUserProfilePictureService;
const db_1 = require("../db/db");
async function getUserProfilePictureService(userId) {
    const result = await db_1.db.query(`
      SELECT id, image_url, is_current, created_at
      FROM profile_pictures
      WHERE user_id = $1 AND is_current = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `, [userId]);
    if (result.rows.length === 0) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row.id,
        imageUrl: row.image_url,
        isCurrent: row.is_current,
        createdAt: row.created_at,
    };
}
