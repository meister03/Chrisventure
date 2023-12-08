import { EmbedBuilder } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";

export default class ShopCommand extends BaseCommand {
    static name = 'shop';
    static description = 'Explore enchanting upgrades and items to amplify your quest.';
    static category = 'Bot';
    static slashcommand = {
        name: 'shop',
        description: 'Explore enchanting upgrades and items to amplify your quest.',
        options: [],
    };
    static slash = { 
        name: "shop",
        category: "bot",
        deploy: ShopCommand.slashcommand,
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

        const userInfo = [];
        userInfo.push(`${CONSTANTS.EMOJIS.DOT} **Snowballs:** ${"`" + cachedUser?.snowBallAmount + "`"}${CONSTANTS.EMOJIS.SNOWBALL}`);
        userInfo.push(`${CONSTANTS.EMOJIS.DOT} **Snowballs Production/h:** ${"`" + (cachedUser?.elvesCount || 0)*10 + "`"}${CONSTANTS.EMOJIS.SNOWBALL}`);

        const embed = new EmbedBuilder(CONSTANTS.GAME.SHOP.MENU.embed(userInfo.join('\n')));
        embed.setColor("#8ae2ee");

        const componentRow = CONSTANTS.GAME.SHOP.MENU.component(cachedUser?.userId!);

        return this.reply({ embeds: [embed], components: [componentRow] });
    }
}