import type { Client } from "discord.js";
import type CommandManager from "./Managers/CommandManager";
import type { UserManager } from "./Modules/Database/UserManager";

export interface AdvancedClient extends Client<true> {
    commands: CommandManager;
    userManager: UserManager;
}
