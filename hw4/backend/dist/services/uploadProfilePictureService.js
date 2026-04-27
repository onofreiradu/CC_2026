"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePictureService = uploadProfilePictureService;
const db_1 = require("../db/db");
const azureUpload_1 = require("../utils/azureUpload");
async function uploadProfilePictureService(userId, fileBuffer, originalFileName, mimeType) {
    // Upload to Azure Blob Storage
    const imageUrl = await (0, azureUpload_1.uploadFileToAzure)(fileBuffer, originalFileName, mimeType);
    // Set all previous pictures for this user to not current
    await db_1.db.query('UPDATE profile_pictures SET is_current = FALSE WHERE user_id = $1', [userId]);
    // Insert new profile picture
    await db_1.db.query(`
      INSERT INTO profile_pictures (user_id, image_url, is_current)
      VALUES ($1, $2, TRUE)
    `, [userId, imageUrl]);
    // Update user's profile_picture_url
    await db_1.db.query('UPDATE users SET profile_picture_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [imageUrl, userId]);
    return imageUrl;
}
