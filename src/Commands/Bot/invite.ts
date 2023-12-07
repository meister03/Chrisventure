import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { BaseCommand, BaseCommandOptions, ICommand } from "../../Structures/BaseCommand";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";

export default class InviteCommand extends BaseCommand {
    static name = 'invite';
    static description = 'Summon friends, collect snowballs, and embark on a holiday adventure together!';
    static category = 'Bot';
    static slashcommand = {
        name: 'invite',
        description: 'Summon friends, collect snowballs, and embark on a holiday adventure together!',
        options: [],
    };
    static slash = {
        name: "invite",
        category: "bot",
        deploy: InviteCommand.slashcommand,
    };
    constructor(client: AdvancedClient, data: BaseCommandOptions) {
        super(client, data)
    }
    async execute() {
        const embed = new EmbedBuilder();
        embed.setTitle("Save Christmas with Santa 🎅✨");
        embed.setDescription(
            `**[Join the mission to save Christmas!\nGather friends, spread cheer, and embark on the festive journey together and retrieve all gifts from Frostbite the Frozen.]` +
            `(https://discord.com/api/oauth2/authorize?client_id=${this.client.application.id}&permissions=274878187520&scope=bot%20applications.commands)**`
        )
        embed.setColor("#178e9e");
        embed.setImage(CONSTANTS.IMAGES.SANTA_SNOWBALL);

        return this.reply({ embeds: [embed] });
    }
}