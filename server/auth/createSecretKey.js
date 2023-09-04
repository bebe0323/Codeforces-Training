import bcrypt from 'bcryptjs';

// export const secretKey = bcrypt.genSaltSync(10);
export const secretKey = `$2a$10$MXM5rWHQGzAsoOEcYAywB.`;
console.log(`secret key ${secretKey}`);