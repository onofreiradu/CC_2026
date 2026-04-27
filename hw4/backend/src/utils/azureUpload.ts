import { BlobServiceClient } from '@azure/storage-blob';
import { randomBytes } from 'node:crypto';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
}
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerName = 'profile-pictures';

export async function uploadFileToAzure(
  buffer: Buffer,
  originalFileName: string,
  mimeType: string
): Promise<string> {
  const fileExtension = originalFileName.split('.').pop() || 'jpg';
  const uniqueFileName = `${randomBytes(8).toString('hex')}-${Date.now()}.${fileExtension}`;

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);

  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return blockBlobClient.url;
}
