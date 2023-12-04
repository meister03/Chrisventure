import { EmbedBuilder } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";

export default class ClaimCommand extends BaseCommand {
    static name = 'claim';
    static description = "Seize the Gift Tracker 3000, Santa's magical compass, and locate the gifts!";
    static category = 'Bot';
    static slashcommand = {
        name: 'claim',
        description: "Seize the Gift Tracker 3000, Santa's magical compass, and locate the gifts!",
        options: [],
    };
    static slash = { 
        name: "claim",
        category: "bot",
        deploy: ClaimCommand.slashcommand,
    };
    constructor(client: AdvancedClient, data: BaseCommandOptions) {
        super(client, data)
    }
    async execute() {
        if(!this.guild) return this.reject("Please join a server to use this command");

        const startCommand = this.client.commands.cache.get('start')?.slash.mention!;

        if(!this.client.userManager.cache.get(this.user.id)) return this.reject(`Please use the ${startCommand} command to start your journey`);

        this.checkIfGuildProfileExists();
        
        const cachedUser = await this.client.userManager.find(this.user.id);

        if(cachedUser?.claimedTracker) return this.reject("You already claimed the Gift Tracker 3000");

        const collectCommand = this.client.commands.cache.get('collect')?.slash.mention!;
        const findCommand = this.client.commands.cache.get('find')?.slash.mention!;
        const prepareCommand = this.client.commands.cache.get('profile')?.slash.mention!;

        const embed = new EmbedBuilder(CONSTANTS.GAME.CLAIM.embed(collectCommand, findCommand, prepareCommand));
        embed.setColor("#9d586b");
        await this.reply({ embeds: [embed] });

        cachedUser!.claimedTracker = true;
        await this.client.userManager.update(cachedUser!);
        return true;
    }
}