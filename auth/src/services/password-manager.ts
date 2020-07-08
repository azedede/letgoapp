import { promisify } from "util";
import { scrypt, randomBytes } from "crypto";

const asyncScript = promisify(scrypt);

export class passwordManager {
  //generating hashed password
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");

    const hash = (await asyncScript(password, salt, 64)) as Buffer;

    return `${hash.toString("hex")}.${salt}`;
  }
  //comparing hashed password

  static async compareHash(storedPassword: string, suppliedPassword: string) {
    const [hash, salt] = storedPassword.split(".");

    const buff = (await asyncScript(suppliedPassword, salt, 64)) as Buffer;

    return buff.toString("hex") === hash;
  }
}
