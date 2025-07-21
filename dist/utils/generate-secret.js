"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Generates a secure random secret key (base64-encoded)
const crypto_1 = __importDefault(require("crypto"));
const generateSecretKey = () => {
    return crypto_1.default.randomBytes(32).toString("base64");
};
console.log(generateSecretKey());
//# sourceMappingURL=generate-secret.js.map