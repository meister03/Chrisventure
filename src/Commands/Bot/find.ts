import { EmbedBuilder } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";
import { PowerUps } from "../../Modules/Economy/PowerUps";
import Collect from "../../Modules/Economy/Collect";


export default class FindCommand extends BaseCommand {
    static name = 'find';
    static description = 'Look for hidden snowballs and items in the icy lands of the North Pole.';
    static category = 'Bot';
    static slashcommand = {
        name: 'find',
        description: 'Look for hidden snowballs and items in the icy lands of the North Pole.',
        options: [],
    };
    static slash = {
        name: "find",
        category: "bot",
        deploy: FindCommand.slashcommand,
    };
    constructor(client: AdvancedClient, data: BaseCommandOptions) {
        super(client, data)
    }
    async execute() {
        if (!this.guild) return this.reject("Please join a server to use this command");

        const profileReady = this.checkIfUserStartedJourney();
        if (!profileReady) return false;

        await this.checkIfGuildProfileExists();
        const cachedUser = await this.client.userManager.find(this.user.id);

        if (cachedUser?.lastSearchedAt) {
            const diff = Date.now() - cachedUser.lastSearchedAt.getTime();
            const time = CONSTANTS.GAME.timeOf(cachedUser.lastSearchedAt.getTime() + 60 * 60 * 1000);
            if (diff < 60 * 60 * 1000) {
                const randomMessage = CONSTANTS.GAME.FIND.FIND_MESSAGES[Math.floor(Math.random() * CONSTANTS.GAME.FIND.FIND_MESSAGES.length)];
                return this.reject(randomMessage.replace("{{time}}", time));
            }
        }


        const collectCommand = this.client.commands.cache.get('collect')?.slash.mention!;
        const shopCommand = this.client.commands.cache.get('shop')?.slash.mention!;

        const snowBallAmount = PowerUps.findSnowBallAmount(cachedUser!);
        const powerUps = PowerUps.viewPowerUps(cachedUser!.powerUps);

        const embed = new EmbedBuilder(CONSTANTS.GAME.FIND.embed(snowBallAmount, powerUps, shopCommand, collectCommand));
        embed.setFooter({text: "Once you have enough snowballs, use /prepare to prepare for the battle"})
        embed.setColor("#178e9e");

        const updatedUser = Collect.collectFindSnowBall(this.client, cachedUser!, snowBallAmount).catch(e => null);
        if (!updatedUser) return this.reject("Something went wrong while finding for snowballs");

        return this.reply({ embeds: [embed] });
    }
}