import { ActivityType, Client, PresenceUpdateStatus } from "discord.js";
import { AdvancedClient } from "../shared";

const ready = async (client: AdvancedClient) => {
    console.log(`[Client] Logged in as ${client.user?.tag}`);

    await client.userManager.load();

    client.commands.load({slash: true});
    client.user.setActivity("for Gifts", { type: ActivityType.Watching });
}

export default ready;