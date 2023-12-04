import { AdvancedClient } from "../../shared";
import { UserDocument } from "../Database/userSchema";

export default class Collect {
    static async collectSnowBall(client: AdvancedClient, user: UserDocument, snowBallAmount: number) {
        user.snowBallAmount += snowBallAmount;
        user.lastCollectedAt = new Date();
        const updatedUser = client.userManager.update(user);
        return updatedUser;
    }

    static async collectFindSnowBall(client: AdvancedClient, user: UserDocument, snowBallAmount: number) {
        user.snowBallAmount += snowBallAmount;
        user.lastSearchedAt = new Date();
        const updatedUser = client.userManager.update(user);
        return updatedUser;
    }
}