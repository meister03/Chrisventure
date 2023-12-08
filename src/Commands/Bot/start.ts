import { EmbedBuilder } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";

export default class StartCommand extends BaseCommand {
    static name = 'start';
    static description = 'Create a Profile to start collecting the gifts';
    static category = 'Bot';
    static slashcommand = {
        name: 'start',
        description: 'Start your journey helping Santa retrieving the gifts back from Frosbite the Frozen',
        options: [],
    };
    static slash = { 
        name: "start", 
        category: "bot",
        deploy: StartCommand.slashcommand,
    };
    constructor(client: AdvancedClient, data: BaseCommandOptions) {
        super(client, data)
    }
    async execute() {
        if(!this.interaction.guildId) return this.reject("Please join a server to use this command");

        let cachedProfile = await this.client.userManager.find(this.user.id);
        
        if(!cachedProfile) {
            cachedProfile = await this.client.userManager.create({
                userId: this.user.id,
                avatar: this.user.avatarURL()!,
                displayName: this.user.displayName,
                guildId: this.interaction.guildId!,
                handle: this.user.username,
            })
        } else await this.checkIfGuildProfileExists();

        const claimCommand = this.client.commands.cache.get('claim')?.slash.mention!;
        const embed = new EmbedBuilder(CONSTANTS.GAME.START.embed(claimCommand));
        embed.setColor("#91c6b1");
        
        return this.reply({ embeds: [embed] });
    }
}