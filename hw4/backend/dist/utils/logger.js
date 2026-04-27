"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUserAction = logUserAction;
async function logUserAction(message, metadata) {
    console.log(`[User Action]: ${message}`, metadata);
}
