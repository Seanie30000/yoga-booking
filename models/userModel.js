
// models/userModel.js
import { usersDb } from './_db.js';
import bcrypt from 'bcrypt';

export const UserModel = {
    async create(user) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return usersDb.insert({ ...user, password: hashedPassword });
    },
    async findByEmail(email) {
        return usersDb.findOne({ email });
    },
    async findById(id) {
        return usersDb.findOne({ _id: id });
    },
    async validatePassword(plainText, hashed) {
        return bcrypt.compare(plainText, hashed);
    },
    async findAll() {
        return usersDb.find({});
    },
    async deleteById(id) {
        return usersDb.remove({ _id: id });
    },
    async update(id, patch) {
        await usersDb.update({ _id: id }, { $set: patch });
        return this.findById(id);
    }
};
