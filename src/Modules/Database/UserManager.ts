import { Document, ObjectId } from 'mongoose';
import { IUser, UserModel, UserDocument, userSchema } from './userSchema';

export class UserManager {
    cache: Map<string, UserDocument>;
    constructor() {
        this.cache = new Map<string, UserDocument>();
    }
    async load() {
        const users = await UserModel.find({});
        users.forEach(user => {
            this.cache.set(user.userId, user);
        });
    }

    async create(
        { userId, avatar, displayName, guildId, handle }:
        { userId: string, avatar: string, displayName: string, guildId: string, handle: string }
    ) {
        const user = await UserModel.create({
            userId,
            avatar,
            displayName,
            handle,
            guildIds: [guildId],
        });
        
        this.cache.set(userId, user);
        return user;
    }

    async checkIfGuildExists(
        { userId, avatar, displayName, guildId, handle }:
        { userId: string, avatar: string, displayName: string, guildId: string, handle: string }
    ) {
        const user = await this.find(userId);
        if (!user) return false;
        if(user.guildIds.includes(guildId)) return true;

        user.avatar = avatar;
        user.displayName = displayName;
        user.handle = handle;

        user.guildIds.push(guildId);
        await this.update(user);
        return true;
    }

    async delete(userId: string) {
        const user = await this.find(userId);
        if (!user) return false;

        const deleted = await UserModel.deleteOne({ userId });
        if(!deleted) return false;
        this.cache.delete(userId);
        return true;
    }

    async find(userId: string) {
        const user = this.cache.get(userId);
        if (user) return user;
        const newUser = await UserModel.findOne({ userId });
        if (newUser) {
            this.cache.set(userId, newUser);
            return newUser;
        }
        return null;
    }

    async update(user: UserDocument) {
        const updatedUser = await user.save();
        return this.cache.set(updatedUser.userId, updatedUser);
    }
}