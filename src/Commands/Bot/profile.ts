import { ApplicationCommandOptionType, EmbedBuilder, SlashCommandUserOption } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";
import { PowerUps } from "../../Modules/Economy/PowerUps";
import Collect from "../../Modules/Economy/Collect";

export default class ProfileCommand extends BaseCommand {
    static name = 'profile';
    static description = 'Check your and user profiles. See snowball count, gifts collected, and shop items.';
    static category = 'Bot';
    static slashcommand = {
        name: 'profile',
        description: 'Check your and user profiles. See snowball count, gifts collected, and shop items.',
        options: [
            {
                name: 'user',
                description: 'The user to check profile for.',
                type: ApplicationCommandOptionType.String,
                required: false,
            }
        ],
    };
    static slash = {
        name: "profile",
        category: "bot",
        deploy: ProfileCommand.slashcommand,
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

        const user = this.interaction.options.getUser('user') ?? this.user;

        const selectedUser = this.client.userManager.cache.get(user.id);
        if (!selectedUser) return this.reject("User hasn't joined the quest yet");

        const unsafeSnowBallAmount = selectedUser.snowBallAmount;
        const storageSnowBallAmount = selectedUser.storage.amount;
        const totalAttackAttempts = selectedUser.totalAttackAttempts;
        const totalVisitedLocations = selectedUser.locations.filter(l => l.defeated).length;
        const totalGiftsCollected = selectedUser.locations.filter(l => l.defeated).map(l => l.giftCount).reduce((a, b) => a + b, 0);

        const powerUps = PowerUps.viewPowerUps(selectedUser.powerUps);
        const elves = selectedUser.elvesCount;

        const woodenSleigh = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH.find(i => i.capacity === selectedUser.storage.capacity)!;

        const snowballs = [];
        snowballs.push(`${CONSTANTS.EMOJIS.DOT} **${"`" + unsafeSnowBallAmount + "`"}** ${CONSTANTS.EMOJIS.SNOWBALL}`);
        if (storageSnowBallAmount) {
            snowballs.push(`${CONSTANTS.EMOJIS.DOT} **${"`" + storageSnowBallAmount + "/" + selectedUser.storage.capacity + "`"}** in wooden sleigh ${CONSTANTS.EMOJIS.SLEIGH}`);
            snowballs.push(`${CONSTANTS.EMOJIS.DOT} **Owns ${"`" + woodenSleigh.name + "`"}**`);
        }

        const totalGiftCount = CONSTANTS.GAME.LOCATIONS.map(l => l.giftCount).reduce((a, b) => a + b, 0);

        const gifts = [];
        gifts.push(`${CONSTANTS.EMOJIS.DOT} **${"`" + totalGiftsCollected + "/" + totalGiftCount + "`"} Gifts colleted**`);
        gifts.push(`${CONSTANTS.EMOJIS.DOT} **${"`" + totalVisitedLocations + "/" + CONSTANTS.GAME.LOCATIONS.length + "`"} Locations visited**`);

        const items = PowerUps.viewItems(selectedUser.items);

        const embed = new EmbedBuilder();
        embed.setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() });
        embed.setThumbnail(CONSTANTS.IMAGES.SANTA_GIFTS);
        embed.setFields([
            { name: "Snowballs", value: snowballs.join('\n'), inline: true },
            { name: "Gifts", value: gifts.join('\n'), inline: true },
            { name: "Items", value: items.length ? items : '> No items', inline: true },
            { name: "Power Ups", value: powerUps.length ? powerUps : '> No power ups', inline: true },
        ]);

        embed.setColor("#8ae2ee");
        return this.reply({ embeds: [embed] });
    }
}