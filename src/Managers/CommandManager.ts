import path from "path";
import fs from "fs";
import { ChatInputCommandInteraction, Client, Collection, ColorResolvable, Colors, EmbedBuilder } from "discord.js";
import { BaseCommand, ICommand } from "../Structures/BaseCommand";
import { AdvancedClient } from "../shared";

const resolveFolder = (folderName: string) => path.resolve(__dirname, ".", folderName);

class CommandManager {
    client: Client<boolean>;
    ready: boolean = false;
    cache: Collection<string, ICommand>;

    constructor(client: AdvancedClient) {
        this.client = client;
        this.cache = new Collection();
    }

    load(options: any = {}) {
        const commandsFolder = resolveFolder("../Commands");
        const data: any[] = [];

        fs.readdirSync(commandsFolder).map(async (dir) => {
            if (dir.endsWith(".txt")) return;
            if (dir.includes('[DISABLED]')) return;
            fs.readdirSync(path.join(commandsFolder, dir)).map((cmd) => {
                if (!cmd.endsWith(".js")) return;
                const commandpath = path.join(commandsFolder, dir, cmd);
                if (options.reload) delete require.cache[require.resolve(commandpath)];
                const {default: pull }= require(path.join(commandpath));
                if (pull.name) this.cache.set(pull.name, pull);
                if (pull.slash?.deploy?.name) data.push(pull.slash.deploy);
            });
        })

        this.patchCommandIds();

        if (options.slash) {
            this.client.application?.commands.set(data).catch(console.error);
        }
        this.ready = true;
        console.log(`[Loaded Commands] ${this.cache.size}`);
    }

    async patchCommandIds() {
        const rawCommands = await this.client.application?.commands.fetch()!;
        const commands = [...rawCommands.values()];
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];

            let subCommand = this.cache.find(x => x.slash?.category === command.name) || this.cache.find(x => x.name === command.name);

            if (subCommand) {
                if (!subCommand.slash) subCommand.slash = { category: command.name, id: command.id, mentions: new Map(), name: command.name };
                else subCommand.slash.id = command.id, subCommand.slash.mentions = new Map();

                command.options.forEach((sub) => {
                    if (sub.type === 1 || sub.type === 2) {
                        subCommand = this.cache.find(
                            x =>
                                x.slash?.category === command.name &&
                                (Array.isArray(x.slash?.name) ? x.slash.name.includes(sub.name) : x.slash?.name === sub.name)
                        ) || subCommand;
                        if (!subCommand) return console.log(`[Slash] Missing Subcommand: ${sub.name} in ${command.name}`)
                        if (!subCommand.slash) subCommand.slash = { category: sub.name, name: command.name, id: command.id, mentions: new Map() };
                        else subCommand.slash.id = command.id, subCommand.slash.mentions = new Map();
                    }
                    if (sub.type === 2 && subCommand) {
                        sub.options?.forEach((option) => {
                            if (option.type === 1) subCommand!.slash.mentions.set(option.name, `</${command.name} ${sub.name} ${option.name}:${command.id}>`);
                            else subCommand!.slash.mentions.set(sub.name, `</${command.name} ${sub.name}:${command.id}>`);
                        });
                    } else if (sub.type === 1 && subCommand) {
                        subCommand.slash.mentions.set(sub.name, `</${command.name} ${sub.name}:${command.id}>`);
                    } else if (subCommand) {
                        subCommand.slash.mentions.set(sub.name, `</${command.name}:${command.id}>`);
                    }
                })
                subCommand.slash.mention = `</${command.name}:${command.id}>`;
                this.cache.set(subCommand.name, subCommand);
            }
        }
    }

    async onInteraction(interaction: ChatInputCommandInteraction) {
        const commandName = interaction.commandName;
        const command = this.cache.get(commandName)!;

        // @ts-ignore
        const baseCommand = new command(
            this.client,
            {
                interaction: interaction,
            }
        ) as ICommand;

        return baseCommand.execute();
    }


    createCooldownMessage(description: string) {
        const tick = "";
        const rejectembed = new EmbedBuilder();
        rejectembed.setDescription(tick + description)
        rejectembed.setColor(Config.embed.cooldown as ColorResolvable)
        rejectembed.toJSON();
        return { embeds: [rejectembed] };
    }
}

export default CommandManager;

function parseOptions(option: any) {
    return { type: option.type, name: option.name, value: option.value }
}
