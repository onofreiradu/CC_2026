"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToAzure = uploadFileToAzure;
const storage_blob_1 = require("@azure/storage-blob");
const node_crypto_1 = require("node:crypto");
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
}
const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
const containerName = 'profile-pictures';
async function uploadFileToAzure(buffer, originalFileName, mimeType) {
    const fileExtension = originalFileName.split('.').pop() || 'jpg';
    const uniqueFileName = `${(0, node_crypto_1.randomBytes)(8).toString('hex')}-${Date.now()}.${fileExtension}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);
    await blockBlobClient.upload(buffer, buffer.length, {
        blobHTTPHeaders: {
            blobContentType: mimeType,
        },
    });
    return blockBlobClient.url;
}
