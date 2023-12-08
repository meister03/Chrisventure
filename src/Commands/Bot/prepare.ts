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

        const cachedUser = await this.client.userManager.find(this.user.id);

        if(!cachedUser) return this.reject(`Please use the ${startCommand} command to start your journey`);

        const allLocationsDefeated = cachedUser?.locations.every(l => l.defeated === true) && cachedUser?.locations.length === CONSTANTS.GAME.LOCATIONS.length;

        let nextLocationId = CONSTANTS.GAME.LOCATIONS[0].id;

        for (let i = 0; i < CONSTANTS.GAME.LOCATIONS.length; i++) {
            const findLocation = cachedUser.locations.find(l => l.id === CONSTANTS.GAME.LOCATIONS[i].id);
            if (!findLocation || findLocation?.defeated === false) {
                nextLocationId = CONSTANTS.GAME.LOCATIONS[i].id;
                break;
            }
        }

        return Prepare.embed(this.client, this.interaction, cachedUser!, nextLocationId, true);
    }
}