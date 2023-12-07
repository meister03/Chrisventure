import { EmbedBuilder } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";
import { PowerUps } from "../../Modules/Economy/PowerUps";
import Collect from "../../Modules/Economy/Collect";

export default class CollectCommand extends BaseCommand {
    static name = 'collect';
    static description = 'Gather your hourly snowballs from the hardworking Christmas elves.';
    static category = 'Bot';
    static slashcommand = {
        name: 'collect',
        description: 'Gather your hourly snowballs from the hardworking Christmas elves.',
        options: [],
    };
    static slash = { 
        name: "collect",
        category: "bot",
        deploy: CollectCommand.slashcommand,
    };
    constructor(client: AdvancedClient, data: BaseCommandOptions) {
        super(client, data)
    }
    async execute() {
        if(!this.guild) return this.reject("Please join a server to use this command");

        const profileReady = this.checkIfUserStartedJourney();
        if(!profileReady) return false;

        await this.checkIfGuildProfileExists();
        const cachedUser = await this.client.userManager.find(this.user.id);

        if(cachedUser?.lastCollectedAt) {
            const diff = Date.now() - cachedUser.lastCollectedAt.getTime();
            const time = CONSTANTS.GAME.timeOf(cachedUser.lastCollectedAt.getTime() + 60*60*1000);
            if(diff < 60*60*1000) return this.reject("Elves are on a cocoa break. Return in " + time + " for more magical snowballs.");
        }

        const findCommand = this.client.commands.cache.get('find')?.slash.mention!;
        const shopCommand = this.client.commands.cache.get('shop')?.slash.mention!;

        const snowBallAmount = PowerUps.calculateSnowBallAmount(cachedUser!);
        const powerUps = PowerUps.viewPowerUps(cachedUser!.powerUps);

        const embed = new EmbedBuilder(CONSTANTS.GAME.COLLECT.embed(snowBallAmount, powerUps, findCommand, shopCommand));
        embed.setColor("#91c6b1");

        const updatedUser = Collect.collectSnowBall(this.client, cachedUser!, snowBallAmount).catch(e => null);
        if(!updatedUser) return this.reject("Something went wrong while collecting your snowballs");

        return this.reply({ embeds: [embed] });
    }
}