export async function logUserAction(message: string, metadata: object) {
  console.log(`[User Action]: ${message}`, metadata);
}