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
                type: ApplicationCommandOptionType.User,
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
        if (!this.interaction.guildId) return this.reject("Please join a server to use this command");

        const profileReady = this.checkIfUserStartedJourney();
        if (!profileReady) return false;

        await this.checkIfGuildProfileExists();
        const cachedUser = await this.client.userManager.find(this.user.id);

        const user = this.interaction.options.getUser('user') ?? this.user;

        const selectedUser = this.client.userManager.cache.get(user.id);
        
        if (!selectedUser) return this.reject("User hasn't joined the quest yet.");

        const unsafeSnowBallAmount = selectedUser.snowBallAmount;
        const storageSnowBallAmount = selectedUser.storage.amount;
        const totalAttackAttempts = selectedUser.locations.map(l => l.attempts).reduce((a, b) => a + b, 0);
        const totalVisitedLocations = selectedUser.locations.filter(l => l.defeated).length;
        const totalGiftsCollected = selectedUser.locations.filter(l => l.defeated).map(l => l.giftCount).reduce((a, b) => a + b, 0);

        const gifts = [];
        const snowballs = [];
        const powerUps = PowerUps.viewPowerUps(selectedUser.powerUps,false , CONSTANTS.EMOJIS.DOT+ ' ');
        let items = PowerUps.viewItems(selectedUser.items, CONSTANTS.EMOJIS.DOT+ ' ');
      
        const woodenSleigh = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH.find(i => i.capacity === selectedUser.storage.capacity)!;
        
        snowballs.push(`${CONSTANTS.EMOJIS.DOT} **${"`" + unsafeSnowBallAmount + "`"}** ${CONSTANTS.EMOJIS.SNOWBALL}`);
        
        if (selectedUser.storage.unlocked) {
            snowballs.push(`${CONSTANTS.EMOJIS.DOT} **${"`" + storageSnowBallAmount + "/" + selectedUser.storage.capacity + "`"}** in wooden sleigh ${CONSTANTS.EMOJIS.SLEIGH}`);
            snowballs.push(`${CONSTANTS.EMOJIS.DOT} **Owns ${"`" + woodenSleigh.name.replace("Unlock", "Basic")  + "`"}**`);
        }
        
        const totalGiftCount = CONSTANTS.GAME.LOCATIONS.map(l => l.giftCount).reduce((a, b) => a + b, 0);
        
        gifts.push(`${CONSTANTS.EMOJIS.DOT} **${"`" + totalGiftsCollected + "/" + totalGiftCount + "`"} Gifts colleted**`);
        gifts.push(`${CONSTANTS.EMOJIS.DOT} **${"`" + totalVisitedLocations + "/" + CONSTANTS.GAME.LOCATIONS.length + "`"} Locations visited**`);
        gifts.push(`${CONSTANTS.EMOJIS.DOT} **${"`" + totalAttackAttempts + "`"} Attacks attempted**`);
        
        
        items+=(`\n${CONSTANTS.EMOJIS.DOT} **Hired Elves** - ${"`" + selectedUser.elvesCount + "`"}`);


        const fields = [
            { name: "Snowballs", value: snowballs.join('\n'), inline: true },
            { name: "Gifts/Attack", value: gifts.join('\n'), inline: true },
            { name: "Items", value: items.length ? items : '> No items'},
        ];

        if (selectedUser.userId === this.user.id) {
            fields.push({ name: "Active Power Ups", value: powerUps.length ? powerUps : '> No power ups' });
        }

        const embed = new EmbedBuilder();
        embed.setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() });
        embed.setThumbnail(CONSTANTS.IMAGES.SANTA_GIFTS);
        embed.setFooter({text: "Once you have enough snowballs, use /prepare to prepare for the battle"})
        embed.setFields(fields);

        embed.setColor("#8ae2ee");
        return this.reply({ embeds: [embed] });
    }
}