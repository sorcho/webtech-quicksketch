import { database, User } from "../models/Database.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
    console.error("Usage: node scripts/createUser.js <username> <password>");
    process.exit(1);
}

try {
    await database.sync();
    const user = await User.create({ username, password });
    console.log(`Created user "${user.username}" with id ${user.id}`);
} catch (err) {
    console.error(err.message);
} finally {
    await database.close();
}