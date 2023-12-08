import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";

export default class LeaderboardCommand extends BaseCommand {
    static name = 'leaderboard';
    static description = 'Compete for the top spot on the Merry Leaderboard and check, who already secured all gifts';
    static category = 'Bot';
    static slashcommand = {
        name: 'leaderboard',
        description: 'Compete for the top spot on the Merry Leaderboard and check, who already secured all gifts',
        options: [
            {
                name: "type",
                description: "Type of leaderboard",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                    {
                        name: "Server Members",
                        value: "server"
                    },
                    {
                        name: "Global",
                        value: "global"
                    }
                ],
            }
        ],
    };
    static slash = {
        name: "leaderboard",
        category: "bot",
        deploy: LeaderboardCommand.slashcommand,
    };
    constructor(client: AdvancedClient, data: BaseCommandOptions) {
        super(client, data)
    }
    async execute() {
        if (!this.interaction.guildId) return this.reject("Please join a server to use this command");

        const profileReady = this.checkIfUserStartedJourney();
        if (!profileReady) return false;

        await this.checkIfGuildProfileExists();
        const cachedUser = await this.client.userManager.find(this.user.id);

        const type = this.interaction.options.getString("type") ?? "global";

        const users: { name: string, id: string, giftCount: number, snowBallAmount: number }[] = [];

        let globalUsers = [...this.client.userManager.cache.values()];
        if (type === "server" && this.interaction.guildId) globalUsers = globalUsers.filter(u => u.guildIds.includes(this.interaction.guildId!));

        for (const user of globalUsers) {
            users.push({
                name: user.displayName,
                id: user.id,
                giftCount: user.locations.filter(l => l.defeated).map(l => l.giftCount).reduce((a, b) => a + b, 0),
                snowBallAmount: user.snowBallAmount,
            });
        }

        users.sort((a, b) => {
            if (a.giftCount === b.giftCount) return b.snowBallAmount - a.snowBallAmount;
            return b.giftCount - a.giftCount;
        });

        const entries = users.map((u, i) => {
            const rank = i + 1;
            const snowballs = u.snowBallAmount;
            const gifts = u.giftCount;
            return `**${rank}. ${u.name} - ${"`" + snowballs + "`"} ${CONSTANTS.EMOJIS.SNOWBALL} | ${"`" + gifts + "`"} 🎁**`;
        });

        const embed = new EmbedBuilder()
            .setTitle("Merry Leaderboard")
            .setDescription(entries.join("\n"))
            .setThumbnail(CONSTANTS.IMAGES.SANTA_GIFTS)
            .setColor("#178e9e");

        return this.reply({ embeds: [embed] });
    }
}