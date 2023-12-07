import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";

export default class HelpCommand extends BaseCommand {
    static name = 'help';
    static description = 'Discover the commands and know how to defeat Frostbite the Frozen';
    static category = 'help';
    static slashcommand = {
        name: 'help',
        description: 'Discover the commands and know how to defeat Frostbite the Frozen',
        options: [],
    };
    static slash = {
        name: "help",
        category: "bot",
        deploy: HelpCommand.slashcommand,
    };
    constructor(client: AdvancedClient, data: BaseCommandOptions) {
        super(client, data)
    }
    async execute() {
        const profileReady = this.checkIfUserStartedJourney();
        if (!profileReady) return false;

        await this.checkIfGuildProfileExists();

        const claimCommand = this.client.commands.cache.get('claim')?.slash.mention!;
        const collectCommand = this.client.commands.cache.get('collect')?.slash.mention!;
        const shopCommand = this.client.commands.cache.get('shop')?.slash.mention!;
        const findCommand = this.client.commands.cache.get('find')?.slash.mention!;
        const prepareCommand = this.client.commands.cache.get('prepare')?.slash.mention!;
        const profileCommand = this.client.commands.cache.get('profile')?.slash.mention!;
        const leaderboardCommand = this.client.commands.cache.get('leaderboard')?.slash.mention!;

        const embed = new EmbedBuilder();
        embed.setTitle("Get Started");
        embed.setDescription(
            [
                `1. 🎁 **Claim the Special Device:**\n> Join Santa in his quest to retrieve the stolen gifts. Use ${claimCommand} to equip the Gift Tracker 3000.`,
                `2. ❄️ **Collect Snowballs:**\n> The Christmas elves are tirelessly collecting magical snowballs. Use ${collectCommand} to gather **10 snowballs per hour.**`,
                `3. 🛒 **Visit the Shop:**\n> **Enhance your** elf's **abilities** with power-ups from the ${shopCommand}. Strengthen your snowball collection efforts!`,
                `4. 🧤 **Find Snowballs:**\n> Explore your area and **find hidden snowballs** with ${findCommand}. The more you explore, the more snowballs you'll discover.`,
                `5. 📌 **Prepare for the Monster:**\n> Get the current monster location and prepare for the battle with ${prepareCommand}. Each day, face a different monster from the **raid and retrieve the gifts.**`,
                `6. ⬆️ **Upgrade Your Items:**\n> Boost your snowball collection speed by upgrading items in the ${shopCommand}. **Get more snowballs** and save Christmas faster!`,
                `7. 📃 **Check Your Profile:**\n> Keep track of **your progress** with ${profileCommand}. Monitor your snowball count, collected gifts, and purchased shop items.`,
                `8. 🏆 **Climb the Leaderboard:**\n> **Compete against other users** and climb the ranks on the leaderboard with ${leaderboardCommand}. Show everyone that you're Santa's top helper!`,
                ``,
                `**Embark on this thrilling Blizzard Brawl, defeat the frosty monsters, and secure a joyous Christmas for children worldwide! The fate of the holiday season rests in your hands. Let the snowballs fly!**`
            ].join('\n')
        )
        embed.setColor("#178e9e");
        return this.reply({ embeds: [embed] });
    }
}