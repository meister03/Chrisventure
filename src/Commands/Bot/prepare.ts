import { EmbedBuilder } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";
import Prepare from "../../Modules/Economy/Prepare";

export default class PrepareCommand extends BaseCommand {
    static name = 'prepare';
    static description = "Gear up for battle at the chosen location. The Gift Tracker 3000 pinpoints the locations.";
    static category = 'Bot';
    static slashcommand = {
        name: 'prepare',
        description: "Gear up for battle at the chosen location. The Gift Tracker 3000 pinpoints the locations.",
        options: [],
    };
    static slash = {
        name: "prepare",
        category: "bot",
        deploy: PrepareCommand.slashcommand,
    };
    constructor(client: AdvancedClient, data: BaseCommandOptions) {
        super(client, data)
    }
    async execute() {
        if (!this.interaction.guildId) return this.reject("Please join a server to use this command");

        const startCommand = this.client.commands.cache.get('start')?.slash.mention!;

        if (!this.client.userManager.cache.get(this.user.id)) return this.reject(`Please use the ${startCommand} command to start your journey`);

        this.checkIfGuildProfileExists();

        const cachedUser = await this.client.userManager.find(this.user.id)!;

        const allLocationsDefeated = cachedUser?.locations.every(l => l.defeated === true) && cachedUser?.locations.length === CONSTANTS.GAME.LOCATIONS.length;


        const nextLocationId = cachedUser?.locations.filter(l => l.defeated === false).map(x => x.id)
            .sort((a, b) => a - b)?.[0] ?? (allLocationsDefeated ? (CONSTANTS.GAME.LOCATIONS.length - 1) : 0);

        return Prepare.embed(this.client, this.interaction, cachedUser!, nextLocationId, true);
    }
}