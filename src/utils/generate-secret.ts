// Generates a secure random secret key (base64-encoded)
import crypto from "crypto";

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("base64");
};

console.log(generateSecretKey()); 