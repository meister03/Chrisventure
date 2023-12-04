import { APIInteractionGuildMember, ApplicationCommand, ApplicationCommandData, ChatInputCommandInteraction, Client, EmbedBuilder, Guild, GuildChannel, GuildMember, Interaction, InteractionReplyOptions, TextBasedChannel, User } from "discord.js";
import type { AdvancedClient } from "../shared";

export interface ICommand extends BaseCommand {
    name: string;
    slash: {
        name: string;
        category: string;
        id: string;
        mentions: Map<string, string>;
        mention?: string;
        deploy?: ApplicationCommandData;
    }
    constructor(client: AdvancedClient, data: BaseCommandOptions): void;
    execute(): Promise<any>;
}

export interface BaseCommandOptions {
    interaction: ChatInputCommandInteraction;
}
export interface CommandContext {
    user: User;
    guild: Guild;
    member: APIInteractionGuildMember | GuildMember;
    channel: TextBasedChannel;
    client: AdvancedClient;
}

export class BaseCommand {
    interaction: ChatInputCommandInteraction;
    user: CommandContext['user'];
    guild:CommandContext['guild'] | null;
    member: CommandContext['member'] | null;
    channel: CommandContext['channel'] | null;
    client: AdvancedClient;
     constructor(client: AdvancedClient, data: BaseCommandOptions) {
          this.interaction = data.interaction;
          this.user = this.interaction.user;
          this.guild =  this.interaction.guild;
          this.member =  this.interaction.member;
          this.channel = this.interaction.channel;
          this.client = client;
     }

    reply(messageOptions: InteractionReplyOptions){
        return this.interaction.reply({fetchReply: false, ...messageOptions});
    }

    async checkIfGuildProfileExists(){
        const exists = await this.client.userManager.checkIfGuildExists({
            userId: this.user.id,
            avatar: this.user.avatarURL()!,
            displayName: this.user.displayName,
            guildId: this.guild?.id!,
            handle: this.user.username,
        });
        return exists;
    }

    checkIfUserStartedJourney(){
        const startCommand = this.client.commands.cache.get('start')?.slash.mention!;
        const claimCommand = this.client.commands.cache.get('claim')?.slash.mention!;

        const cachedUser = this.client.userManager.cache.get(this.user.id);
        if(!cachedUser) {
            this.reject(`Please use the ${startCommand} command to start your journey`);
            return false;
        } else if (!cachedUser.claimedTracker) {
            this.reject(`Please claim the Gift Tracker 3000 using the ${claimCommand} command`);
            return false;
        }

        return true;
    }

    verify(content: string, reason: string){
        const tick = '<:modtick:810573772201394207>';
        reason = reason ? " | " + reason : "";
        const rejectembed = new EmbedBuilder();
        rejectembed.setDescription(tick + content + reason)
        rejectembed.setColor('#03cc7f')
        rejectembed.toJSON();
        return this.reply({ embeds: [rejectembed] })
    }

    reject(content: string, reason?: string){
        const cross = '<:modcross:810573772146212874>';
        reason = reason ? " | " + reason : "";
        const rejectembed = new EmbedBuilder();
        rejectembed.setDescription(cross + content + reason)
        rejectembed.setColor('#d32f2f')
        rejectembed.toJSON();
        return this.reply({ embeds: [rejectembed] })
    }
}