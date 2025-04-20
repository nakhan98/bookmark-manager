import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const authFilePath = path.join(process.cwd(), 'data', 'auth.json');

export async function readAuth() {
  try {
    const data = await fs.readFile(authFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export async function writeAuth(authData) {
  await fs.mkdir(path.dirname(authFilePath), { recursive: true });
  await fs.writeFile(authFilePath, JSON.stringify(authData, null, 2));
}

export function hashPassword(password, timestamp) {
  const salt = 'static_salt'; // In production use a per-user dynamic salt.
  return crypto.createHash('sha1').update(salt + password + timestamp).digest('hex');
}
