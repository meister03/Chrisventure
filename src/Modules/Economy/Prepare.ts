import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { AdvancedClient } from "../../shared";
import { UserDocument } from "../Database/userSchema";
import CONSTANTS from "../../Constants/Constants";

export default class Prepare {

    static estimatedSnowballsNeeded(xp: number) {
        const minEstimatedSnowballForDefeat = Math.ceil((xp / CONSTANTS.GAME.ITEM.SNOWBALL.damage.max));
        const maxEstimatedSnowballForDefeat = Math.ceil((xp / CONSTANTS.GAME.ITEM.SNOWBALL.damage.min));
        return { min: minEstimatedSnowballForDefeat, max: maxEstimatedSnowballForDefeat };
    }

    static isOnline(locationId: number) {
        const location = CONSTANTS.GAME.LOCATIONS.find(l => l.id === locationId);
        if (!location) return false;

        // Get Day of Dec
        const now = new Date();
        const day = now.getDate();
        return day >= location.day;
    }

    static getDate(locationId: number) {
        const location = CONSTANTS.GAME.LOCATIONS.find(l => l.id === locationId);
        if (!location) return 0;

        const now = new Date()
        now.setDate(location.day);
        now.setHours(0, 0, 0, 0);
        return now.getTime();
    }

    static embed(client: AdvancedClient, interaction: ChatInputCommandInteraction | StringSelectMenuInteraction, cachedUser: UserDocument, locationId: number, initial: boolean) {
        const allLocationsDefeated = cachedUser?.locations.every(l => l.defeated === true) && cachedUser?.locations.length === CONSTANTS.GAME.LOCATIONS.length;
        const isOnline = this.isOnline(locationId);
        const nextLocation = CONSTANTS.GAME.LOCATIONS[locationId];
        const monster = CONSTANTS.GAME.MONSTERS[nextLocation.id];

        const userGetLocation = cachedUser?.locations.find(l => l.id === locationId);

        let attackableStr = (this.getDate(locationId) < Date.now() ? "`YES`" : CONSTANTS.GAME.timeOf(this.getDate(locationId)));
        if(userGetLocation?.defeated) attackableStr = "`DEFEATED`";

        const locationInfo = [];
        locationInfo.push(`${CONSTANTS.EMOJIS.DOT} **Location:** ${"`" + nextLocation.name + "`"}`);
        // locationInfo.push(`**Difficulty:** ${nextLocation.difficulty}`); @TODO add candle emoji
        locationInfo.push(`${CONSTANTS.EMOJIS.DOT} **Located Gifts:** ${"`" + nextLocation.giftCount + "`"}`);
        locationInfo.push(`${CONSTANTS.EMOJIS.DOT} **Attackable: ** ${attackableStr}`);

        const monsterInfo = [];
        monsterInfo.push(`${CONSTANTS.EMOJIS.DOT} **Name:** ${"`" + monster.shortName + "`"}`);
        monsterInfo.push(`${CONSTANTS.EMOJIS.DOT} **Health:** ${"`" + monster.xp}HP` + "`");

        const attackInfo = [];
        attackInfo.push(`${CONSTANTS.EMOJIS.DOT} **Gifts retrieved:** ${"`" + (userGetLocation?.defeated ? "YES" : "NO") + "`"}`);
        attackInfo.push(`${CONSTANTS.EMOJIS.DOT} **Attack Attempts:** ${"`" + (userGetLocation?.attempts ?? 0) + "`"}`);
        attackInfo.push(`${CONSTANTS.EMOJIS.DOT} **Last Attack:** ${userGetLocation?.lastAttackedAt ? CONSTANTS.GAME.timeOf(userGetLocation.lastAttackedAt.getTime()) : "`Not Yet`"}`);

        const minEstimatedSnowballForDefeat = this.estimatedSnowballsNeeded(monster.xp).min;
        const maxEstimatedSnowballForDefeat = this.estimatedSnowballsNeeded(monster.xp).max;

        const defeatInfo = [];
        defeatInfo.push(`${CONSTANTS.EMOJIS.DOT} **Estimated Snowballs Needed:** ${"`" + minEstimatedSnowballForDefeat + "-" + maxEstimatedSnowballForDefeat + "`"}`);
        defeatInfo.push(`${CONSTANTS.EMOJIS.DOT} **Wooden Sleigh Capacity:** ${"`" + cachedUser?.storage.capacity + "`"}`);
        defeatInfo.push(`${CONSTANTS.EMOJIS.DOT} **Snowballs in Wooden Sleigh:** ${"`" + cachedUser?.storage.amount + "`"}`);

        const prepareEmbed = new EmbedBuilder();
        prepareEmbed.setTitle("Prepare for Attack");
        prepareEmbed.setDescription(monster.description);
        prepareEmbed.setFields([
            { name: "Location Info", value: locationInfo.join("\n"), inline: true },
            { name: "Monster Info", value: monsterInfo.join("\n"), inline: true },
            { name: "Defeat Info", value: defeatInfo.join("\n"), inline: false },
            { name: "Attack Info", value: attackInfo.join("\n"), inline: true },
        ]);
        prepareEmbed.setImage(monster.image);
        prepareEmbed.setColor("#12e3f4");

        const components = this.getComponents(cachedUser, locationId, { attack: !isOnline || allLocationsDefeated, prepare: !isOnline || allLocationsDefeated });

        if (!initial && interaction.isStringSelectMenu()) {
            interaction.update({ embeds: [prepareEmbed], components: [...components] });
        } else {
            interaction.reply({ embeds: [prepareEmbed], components: [...components] });
        }
    }

    static getComponents(cachedUser: UserDocument, locationId: number, disabled: { attack: boolean, prepare: boolean } = { attack: false, prepare: false }) {
        const rowOne = new ActionRowBuilder<StringSelectMenuBuilder>();
        const rowTwo = new ActionRowBuilder<ButtonBuilder>();

        const options = [];
        for (const location of CONSTANTS.GAME.LOCATIONS) {
            const checkLocation = cachedUser.locations.find(l => l.id === location.id);

            const monster = CONSTANTS.GAME.MONSTERS[location.id];
            const description = checkLocation?.defeated ? ("Retrieved " + checkLocation.giftCount + " gifts from " + monster.shortName) : ("Attack " + monster.shortName + " to retrieve gifts");

            options.push({
                label: this.getLabelFromLocationId(location.id),
                value: location.id.toString(),
                description: description,
                emoji: checkLocation?.defeated ? CONSTANTS.EMOJIS.COLLECT : CONSTANTS.EMOJIS.ATTACK,
                default: location.id === locationId,
            });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("prepareinfo|" + cachedUser.userId + "|" + locationId)
            .setPlaceholder("Select a location to get info on")
            .setOptions(options);

        rowOne.addComponents(selectMenu);

        // Add Button
        const attackButton = new ButtonBuilder()
            .setCustomId("attack|" + cachedUser.userId + "|" + locationId)
            .setLabel("Attack")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(CONSTANTS.EMOJIS.ATTACK)
            .setDisabled(disabled.attack);

        const prepareButton = new ButtonBuilder()
            .setCustomId("prepare|" + cachedUser.userId + "|" + locationId)
            .setLabel("Prepare")
            .setStyle(ButtonStyle.Primary)
            .setEmoji(CONSTANTS.EMOJIS.SNOWBALL)
            .setDisabled(disabled.prepare);

        rowTwo.addComponents(attackButton, prepareButton);

        return [rowOne, rowTwo];
    }

    static getLabelFromLocationId(locationId: number) {
        const location = CONSTANTS.GAME.LOCATIONS.find(l => l.id === locationId);
        if (!location) return "Location does not exist anymore!";
        const isFinalDay = locationId === (CONSTANTS.GAME.LOCATIONS[CONSTANTS.GAME.LOCATIONS.length - 1]).id;

        if (isFinalDay) return "Final Battle | " + location.name + " | " + location.giftCount + " Gifts";
        return "Dec " + location.day + "th | " + location.name + " | " + location.giftCount + " Gifts";
    }

    static executeUpdate(client: AdvancedClient, interaction: StringSelectMenuInteraction) {
        if (!interaction.customId.includes('|' + interaction.user.id)) {
            const prepareOverview = client.commands.cache.get('prepare')?.slash.mention;
            return interaction.reply({ content: `**Please open your own ${prepareOverview} overview!**`, ephemeral: true })
        }

        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        const locationId = interaction.values[0];
        const location = CONSTANTS.GAME.LOCATIONS.find(l => l.id === parseInt(locationId));
        if (!location) return interaction.reply({ content: '**Location does not exit anymore!**', ephemeral: true });

        return Prepare.embed(client, interaction, user, location.id, false);
    }

    static async executePrepare(client: AdvancedClient, interaction: ButtonInteraction) {
        if (!interaction.customId.includes('|' + interaction.user.id)) {
            const prepareOverview = client.commands.cache.get('prepare')?.slash.mention;
            return interaction.reply({ content: `**Please open your own ${prepareOverview} overview!**`, ephemeral: true })
        }

        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        const locationId = interaction.customId.split('|')[2];
        const location = CONSTANTS.GAME.LOCATIONS.find(l => l.id === parseInt(locationId));
        if (!location) return interaction.reply({ content: '**Location does not exit anymore!**', ephemeral: true });

        const allLocationsDefeated = user?.locations.every(l => l.defeated === true) && user?.locations.length === CONSTANTS.GAME.LOCATIONS.length;
        if (allLocationsDefeated) {
            return interaction.reply({ content: '**You already defeated all monsters in the locations!**', ephemeral: true });
        }

        const storageExists = await Prepare.checkIfStorageExists(client, interaction, user);
        if (!storageExists) return;

        // Open Modal
        const modal = new ModalBuilder();
        modal.setTitle("Prepare for Attack");
        modal.setCustomId("preparemodal|" + user.userId + "|" + locationId);

        const rowOne = new ActionRowBuilder<TextInputBuilder>();
        const textInput = new TextInputBuilder();
        textInput.setCustomId("prepare|" + user.userId + "|" + locationId);
        textInput.setLabel("Set Amount of Snowballs in Wooden Sleigh");
        textInput.setPlaceholder("Enter the amount you want to take to the battle");
        if (user.storage.amount) textInput.setValue(user.storage.amount.toString());
        textInput.setStyle(TextInputStyle.Short);

        rowOne.setComponents(textInput);

        modal.setComponents([rowOne]);

        return interaction.showModal(modal);
    }

    static async executePrepareModal(client: AdvancedClient, interaction: ModalSubmitInteraction) {
        if (!interaction.customId.includes('|' + interaction.user.id)) {
            const prepareOverview = client.commands.cache.get('prepare')?.slash.mention;
            return interaction.reply({ content: `**Please open your own ${prepareOverview} overview!**`, ephemeral: true })
        }

        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        const locationId = interaction.customId.split('|')[2];
        const location = CONSTANTS.GAME.LOCATIONS.find(l => l.id === parseInt(locationId));
        if (!location) return interaction.reply({ content: '**Location does not exit anymore!**', ephemeral: true });

        const locationDefeated = await this.checkIfLocationIsDefeated(client, interaction, user, parseInt(locationId));
        if (locationDefeated) return;

        // @ts-ignore
        const storageExists = await Prepare.checkIfStorageExists(client, interaction, user);
        if (!storageExists) return;

        const amount = parseInt(interaction.components[0].components[0].value);

        const infoMessage = "Keep in mind that if you attack the monster, you will lose the amount of snowballs you set in the wooden sleigh. You can't take them back!";
        const totalSnowballAmount = user.storage.amount + user.snowBallAmount;


        if (isNaN(amount) || amount < 0 || amount > (totalSnowballAmount)) {
            return interaction.reply({ content: `**Please enter a valid amount of snowballs between ${"`" + 0 + "`"} and ${"`" + totalSnowballAmount + "`"} (your balance)!\n> ${infoMessage}**`, ephemeral: true });
        } else if(amount > user.storage.capacity) {
            return interaction.reply({ content: `**Please enter a valid amount of snowballs between ${"`" + 0 + "`"} and ${"`" + user.storage.capacity + "`"} (your wooden sleigh capacity)!\n> ${infoMessage}**`, ephemeral: true });
        } else {
            await Prepare.setStorageAmount(client, user, amount, parseInt(locationId));
            return interaction.reply({ content: `**You are prepared for the battle with ${"`" + amount + "`"}${CONSTANTS.EMOJIS.SNOWBALL}\n> ${infoMessage}**`, ephemeral: true });
        }
    }

    static async checkIfStorageExists(client: AdvancedClient, interaction: ButtonInteraction, user: UserDocument) {
        if (!user.storage.unlocked) {
            const shopCommand = client.commands.cache.get('shop')?.slash.mention;
            await interaction.reply({ content: '**Please buy a wooden sleigh in the shop with ' + shopCommand + ' to take your snowballs to the Battle!**', ephemeral: true });
            return false;
        } else return true;
    }

    static async checkIfLocationIsDefeated(client: AdvancedClient, interaction: ButtonInteraction | ModalSubmitInteraction, user: UserDocument, locationId: number) {
        const location = user.locations.find(l => l.id === locationId);
        if (location?.defeated) {
            await interaction.reply({ content: '**You already defeated this monster in this location!**', ephemeral: true });
            return true;
        } else return false;
    }


    static async setStorageAmount(client: AdvancedClient, user: UserDocument, amount: number, locationId: number) {
        user.storage.amount += user.storage.amount;
        user.snowBallAmount -= amount;
        user.storage.amount = amount;

        const location = user.locations.find(l => l.id === locationId);
        const giftLocation = CONSTANTS.GAME.LOCATIONS.find(l => l.id === locationId);

        if (location) {
            // Update location 
            user.locations = user.locations.map(l => {
                if (l.id === locationId) {
                    l.prepared = true;
                    l.defeated = false;
                }
                return l;
            });
        } else {
            // Create location
            user.locations.push({
                id: locationId,
                defeated: false,
                attempts: 0,
                giftCount: giftLocation?.giftCount!,
                prepared: true,
            });
        }

        // Update user
        await client.userManager.update(user);
    }
}