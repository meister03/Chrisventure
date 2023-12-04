import { Client, Events, GatewayIntentBits } from "discord.js";
import CommandManager from "./Managers/CommandManager";
import { AdvancedClient } from "./shared";
import { EventManager } from "./Managers/EventManager";
import { UserManager } from "./Modules/Database/UserManager";
import { connectToDatabase } from "./Modules/Database";

const TOKEN = process.env.DISCORD_TOKEN!;
const MONGO_URL = process.env.MONGO_URL!;

const client = new Client({
    intents: [],
}) as unknown as AdvancedClient;

const eventManager = new EventManager(client as AdvancedClient);
eventManager.load();

client.commands = new CommandManager(client as AdvancedClient);
client.userManager = new UserManager();

// Connection to Discord and Database
client.login(TOKEN);
connectToDatabase(MONGO_URL);


process.on("unhandledRejection", (err) => {
    console.error(err);
});
