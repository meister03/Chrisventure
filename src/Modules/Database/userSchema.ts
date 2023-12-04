import { Schema, model } from "mongoose";

export const userSchema = new Schema<IUser>({
    userId: {type: String, required: true},
    guildIds: {type: [String], required: true},
    avatar: {type: String, required: true},
    displayName: {type: String, required: true},
    handle: {type: String, required: true},
    snowBallAmount: {type: Number, default: 0},
    elvesCount: {type: Number, default: 5},
    /* Wooden Sleigh */
    storage: {
        unlocked: {type: Boolean, default: false},
        capacity: {type: Number, default: 0},
        amount: {type: Number, default: 0},
    },
    locations: {
        type: [{   
            monsterId: { type: String, required: true },
            giftCount: { type: Number, default: 0 },
            defeated: { type: Boolean, default: false },
            prepared: { type: Boolean, default: false },
            lastAttackedAt: { type: Date },
        }],
    },
    items: {
        type: [{
            id: { type: Number, required: true },
            count: { type: Number, default: 0 },
        }],
    },
    powerUps: {
        type: [{
            id: { type: Number, required: true },
            until: { type: Date, required: true },
        }]
    },
    claimedTracker: {type: Boolean, default: false},
    totalAttackAttempts: {type: Number, default: 0},
    lastSearchedAt: {type: Date},
    lastCollectedAt: {type: Date},
}, { collection: "winteruser" });

export const UserModel = model<typeof userSchema>("winteruser", userSchema);

// Typescript Document Type
export interface IUser {
    userId: string;
    guildIds: string[];
    avatar: string;
    displayName: string;
    handle: string;
    snowBallAmount: number;
    elvesCount: number;
    storage: {
        unlocked: boolean;
        capacity: number;
        amount: number;
    };
    locations: {
        monsterId: string;
        giftCount: number;
        defeated: boolean;
        prepared: boolean;
        lastAttackedAt: Date;
    }[];
    items: {
        id: number;
        count: number;
    }[];
    powerUps: {
        id: number;
        until: Date;
    }[];
    claimedTracker: boolean;
    totalAttackAttempts: number;
    lastSearchedAt: Date;
    lastCollectedAt: Date;
}


export type UserDocument = InstanceType<typeof UserModel>;