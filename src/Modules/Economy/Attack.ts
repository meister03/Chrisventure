import { ActionRow, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, EmbedBuilder, InteractionCollector } from "discord.js";
import { AdvancedClient } from "../../shared";
import CONSTANTS from "../../Constants/Constants";
import { UserDocument } from "../Database/userSchema";
import Prepare from "./Prepare";

export default class Attack {
    static async execute(client: AdvancedClient, interaction: ButtonInteraction) {
        const prepareOverview = client.commands.cache.get('prepare')?.slash.mention;
        if (!interaction.customId.includes('|' + interaction.user.id)) {
            return interaction.reply({ content: `**Please open your own ${prepareOverview} overview!**`, ephemeral: true })
        }

        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        const locationId = parseInt(interaction.customId.split('|')[2]);
        const locationInfo = CONSTANTS.GAME.LOCATIONS.find((l) => l.id === locationId);
        const monsterInfo = CONSTANTS.GAME.MONSTERS.find((m) => m.id === locationInfo?.monsterId)!;

        if (!locationInfo) return interaction.reply({ content: '**This location does not exist!**', ephemeral: true });

        const userLocation = user.locations.find((l) => l.id === locationId);
        if (userLocation?.defeated) return interaction.reply({ content: '**You have already retrieved the gift from this location!**', ephemeral: true });

        // Check if prepared for this location
        if (userLocation?.prepared === false) {
            return interaction.reply({ content: `**You have not prepared for this location | Please get some snowballs in your wooden sleigh for this battle with ${prepareOverview}!**`, ephemeral: true });
        }

        const snowballAmount = user.storage.amount;
        const _snowBallAmount = snowballAmount;

        // Reset Location
        const { user: updatedUser, returnSnowballs } = await this.resetLocation(client, user, locationId);

        const replyOptions = this.embed(client, interaction, updatedUser, locationInfo, monsterInfo, snowballAmount, 30, monsterInfo.xp);

        interaction.reply(replyOptions);

        // Open Collector 
        const collector = new InteractionCollector(client, {
            time: CONSTANTS.GAME.DURATION + 6000,
            filter: (i) => i.customId.includes('|live|' + interaction.user.id),
        });

        const minSnowballPerSecond = Math.ceil(snowballAmount / ((CONSTANTS.GAME.DURATION / 1000) - 20));
        const maxSnowballPerSecond = Math.ceil(snowballAmount / ((CONSTANTS.GAME.DURATION / 1000) - 10));
        let embedUpdateTrigger = false;
        let monsterHp = monsterInfo.xp;
        let snowballsLeft = snowballAmount;
        let secondsLeft = CONSTANTS.GAME.DURATION / 1000;

        const interval = setInterval(() => {
            secondsLeft -= 2;
            if (secondsLeft > 30 || secondsLeft <= 0) {
                return;
            }
            if (embedUpdateTrigger) {
                const updatedEmbed = this.embed(client, interaction, updatedUser, locationInfo, monsterInfo, snowballsLeft, secondsLeft, monsterHp);
                interaction.editReply(updatedEmbed);
            }
            embedUpdateTrigger = true;
        }, 2000);

        collector.on('collect', async (i: ButtonInteraction) => {
            const [action, type, userId, locationId] = i.customId.split('|');
            if (action === 'retrieve') {
                i.deferUpdate();
                embedUpdateTrigger = false;
                collector.stop();
            } else {
                // Throw
                const { snowballs, newMonsterHp } = this.calculateDamage(minSnowballPerSecond, maxSnowballPerSecond, monsterHp);
                snowballsLeft -= snowballs;
                monsterHp = newMonsterHp;
                embedUpdateTrigger = false;

                if (monsterHp <= 0) {
                    return collector.stop();
                }

                const updatedEmbed = this.embed(client, interaction, updatedUser, locationInfo, monsterInfo, snowballsLeft, secondsLeft, monsterHp);
                i.update(updatedEmbed);
            }
        });

        const wonCheck = async () => {
            clearInterval(interval);
            const iUser = updatedUser;
            if (monsterHp <= 0) {
                const updatedUser = await this.asyncSetBattleWon(client, iUser, locationId);
                const embed = this.wonEmbed(updatedUser,_snowBallAmount, returnSnowballs, locationInfo, monsterInfo);
                interaction.editReply({ embeds: [embed], components: [] });
                return true;
            }
            return false;
        }

        collector.on('stop', async (collected) => {
            const won = await wonCheck();
            if (won) return;
            const embed = this.lostEmbed(_snowBallAmount, returnSnowballs, locationInfo, monsterInfo);
            interaction.editReply({ embeds: [embed], components: [] });
        });

        collector.on('end', async (collected) => {
            const won = await wonCheck();
            if (won) return;
            const embed = this.lostEmbed(_snowBallAmount, returnSnowballs, locationInfo, monsterInfo);
            interaction.editReply({ embeds: [embed], components: [] });
        });
    }

    static lostEmbed(snowBallAmount: number, returnedSnowballMessage: string, locationInfo: typeof CONSTANTS.GAME.LOCATIONS[number], monsterInfo: typeof CONSTANTS.GAME.MONSTERS[number]) {
        if (returnedSnowballMessage.length > 0) {
            snowBallAmount = Math.ceil(snowBallAmount * 0.5);
        }

        let randomDefeatMessage = CONSTANTS.GAME.DEFEAT_MESSAGES[Math.floor(Math.random() * CONSTANTS.GAME.DEFEAT_MESSAGES.length)];
        randomDefeatMessage = randomDefeatMessage
            .replace('{{location}}', locationInfo.name)
            .replace('{{monster}}', monsterInfo.shortName)
            .replace('{{snowballs}}', snowBallAmount.toString())
            .replace('{{gifts}}', locationInfo.giftCount.toString());
        randomDefeatMessage += returnedSnowballMessage ? "\n\n" + returnedSnowballMessage : "";

        const embed = new EmbedBuilder()
            .setTitle(`You lost the battle against ${monsterInfo.shortName} in ${locationInfo.name}`)
            .setDescription(randomDefeatMessage)
            .setColor('#e74c3c')
            .setImage(CONSTANTS.IMAGES.SANTA_DEFEATED)
        return embed;
    }

    static wonEmbed(user: UserDocument, snowBallAmount: number, returnedSnowballMessage: string, locationInfo: typeof CONSTANTS.GAME.LOCATIONS[number], monsterInfo: typeof CONSTANTS.GAME.MONSTERS[number]) {
        const locations = user.locations;
        const consTotalGifts = CONSTANTS.GAME.LOCATIONS.map(l => l.giftCount).reduce((a, b) => a + b, 0);
        const userGifts = locations.filter(l => l.defeated).map(l => l.giftCount).reduce((a, b) => a + b, 0);
        
        if(locations.every(l => l.defeated) && locations.length === CONSTANTS.GAME.LOCATIONS.length) {
            const currentDateIsBeforeChristmas = new Date().getDate() <= 25;

            const embed = new EmbedBuilder()
                .setTitle(`You won the final battle against ${monsterInfo.shortName} in ${locationInfo.name}`)
                .setDescription(`**Hooray! With ${userGifts} gifts retrieved and ${locations.length} monsters defeated, Christmas is saved! 🎉🎄 Time to celebrate the joy and magic of the season!**`)
                .setColor('#4d9891')
                .setImage(CONSTANTS.IMAGES.SANTA_ENDING)

            if(!currentDateIsBeforeChristmas) {
                embed.setDescription(`**While Christmas may not have been saved this time, Santa's spirit prevails! 🎅✨ He managed to deliver ${userGifts}/${consTotalGifts} gifts. There's always hope for a festive comeback next time!**`)
            }

            return embed;
        }
        
        
        if (returnedSnowballMessage.length > 0) {
            snowBallAmount = Math.ceil(snowBallAmount * 0.5);
        }

        let randomWinMessage = CONSTANTS.GAME.WIN_MESSAGES[Math.floor(Math.random() * CONSTANTS.GAME.WIN_MESSAGES.length)];
        randomWinMessage = randomWinMessage
            .replace('{{location}}', "`" + locationInfo.name + "`")
            .replace('{{monster}}', "`" + monsterInfo.shortName + "`")
            .replace('{{snowballs}}', "`" + snowBallAmount.toString() + "`")
            .replace('{{gifts}}', "`" + locationInfo.giftCount.toString() + "`");
        randomWinMessage += returnedSnowballMessage ? "\n\n" + returnedSnowballMessage : "";

        const embed = new EmbedBuilder()
            .setTitle(`You won the battle against ${monsterInfo.shortName} in ${locationInfo.name}`)
            .setDescription(randomWinMessage)
            .setColor('#4d9891')
            .setImage(CONSTANTS.IMAGES.SANTA_GIFTS)
        return embed;
    }

    static calculateDamage(minSnowballs: number, maxSnowballs: number, monsterHp: number, powerUps: UserDocument['powerUps'] = []) {
        const snowballs = Math.round(Math.random() * (maxSnowballs - minSnowballs + 1) + minSnowballs);

        const minDamage = CONSTANTS.GAME.ITEM.SNOWBALL.damage.min;
        const maxDamage = CONSTANTS.GAME.ITEM.SNOWBALL.damage.max;

        let damage = Math.ceil(Math.random() * (maxDamage - minDamage + 1) + minDamage);

        // Check if Power Up is activated
        const powerUpPercentage = powerUps.filter((p) => p.until > new Date()).map((p) => {
            return CONSTANTS.GAME.ITEMS.find((i) => i.id === p.id)!;
        }).filter((p) => p.type === 'attack' && p.target === 'monster').map((p) => p.increase).reduce((a, b) => a + b, 0) + 1;

        damage = Math.round(damage * powerUpPercentage);

        const newMonsterHp = monsterHp - damage * snowballs;
        return { snowballs, newMonsterHp };
    }

    /** Set prepares to false and empties wooden sleigh */
    static async resetLocation(client: AdvancedClient, user: UserDocument, locationId: number) {
        // Find and update location
        user.locations = user.locations.map((l) => {
            if (l.id === locationId) {
                l.prepared = false;
                l.lastAttackedAt = new Date();
                l.attempts += 1;
            }
            return l;
        });

        let returnSnowballs = "Thanks to your activated power-up `" + CONSTANTS.GAME.ITEMS[4].name + "` you get to keep half of your snowballs!";

        // Check if power up is activated 
        if (user.powerUps.some((p) => p.until > new Date() && p.id === CONSTANTS.GAME.ITEMS[4].id)) {
            user.storage.amount = Math.ceil(user.storage.amount * 0.5);
        } else {
            returnSnowballs = "";
            user.storage.amount = 0;
        }

        const updatedUser = await client.userManager.update(user);
        return { user: updatedUser, returnSnowballs };
    }

    static async asyncSetBattleWon(client: AdvancedClient, user: UserDocument, locationId: number) {
        // Find and update location
        user.locations = user.locations.map((l) => {
            if (l.id === locationId) {
                l.defeated = true;
            }
            return l;
        });

        const updatedUser = await client.userManager.update(user);
        return updatedUser;
    }

    static embed(
        client: AdvancedClient,
        interaction: ButtonInteraction,
        user: UserDocument,
        location: typeof CONSTANTS.GAME.LOCATIONS[number],
        monster: typeof CONSTANTS.GAME.MONSTERS[number],
        snowBallsLeft: number,
        secondsLeft: number,
        hpMonster: number,
    ) {
        const estimatedSnowballsNeeded = Prepare.estimatedSnowballsNeeded(hpMonster);
        const winningPercentage = this.calculateWinningPercentage(estimatedSnowballsNeeded.min, estimatedSnowballsNeeded.max, snowBallsLeft);

        const attachment = new AttachmentBuilder(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A]));
        attachment.setName(`${secondsLeft}attack.png`);

        // Get random monster message
        const randomMessage = monster.attackMessages[Math.floor(Math.random() * monster.attackMessages.length)];

        const userInfo = [];
        userInfo.push(`${CONSTANTS.EMOJIS.DOT} **Snowballs left:** ${"`" + Math.max(snowBallsLeft, 0) + "`"}${CONSTANTS.EMOJIS.SNOWBALL}`);
        userInfo.push(`${CONSTANTS.EMOJIS.DOT} **Seconds left:** ${"`" + Math.min(secondsLeft, 30) + "`"}s`);
        userInfo.push(`${CONSTANTS.EMOJIS.DOT} **Winning chance:** ${"`" + winningPercentage.toFixed(2) + "%`"}${CONSTANTS.EMOJIS.SNOWBALL}`);


        const monsterInfo = [];
        monsterInfo.push(`${CONSTANTS.EMOJIS.DOT} **HP Left:** ${"`" + Math.max(hpMonster, 0) + "`"}❤️`);
        monsterInfo.push(`${CONSTANTS.EMOJIS.DOT} **Snowballs needed:** ${"`" + estimatedSnowballsNeeded.min + "-" + estimatedSnowballsNeeded.max + "`"}${CONSTANTS.EMOJIS.SNOWBALL}`);

        const embed = new EmbedBuilder()
        embed.setTitle(`Attacking ${monster.shortName} in ${location.name} | ${"`" + Math.min(secondsLeft, 30) + "`"}s left`)
        embed.setDescription(randomMessage);
        embed.setFields([
            { name: 'User', value: userInfo.join('\n'), inline: true },
            { name: 'Monster', value: monsterInfo.join('\n'), inline: true },
        ]);
        embed.setImage(monster.image);
        embed.setColor("#866ee4");

        //embed.setImage(`attachment://${secondsLeft}attack.png`);
        const components = new ActionRowBuilder<ButtonBuilder>();

        // Retrieve Button
        const retrieveButton = new ButtonBuilder()
            .setCustomId("retrieve|live|" + user.userId + "|" + location.id)
            .setLabel("Retrieve")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled((secondsLeft * 1000) > CONSTANTS.GAME.DURATION - 5000);

        // Prepare Button
        const throwButton = new ButtonBuilder()
            .setCustomId("throw|live|" + user.userId + "|" + location.id)
            .setLabel("Throw Snowballs")
            .setStyle(ButtonStyle.Primary)
            .setEmoji(CONSTANTS.EMOJIS.SNOWBALL)
            .setDisabled(snowBallsLeft <= 0 || secondsLeft >= 30);

        components.setComponents([retrieveButton, throwButton]);

        return { embeds: [embed], /* attachments: [attachment] ,*/ components: [components] };
    }

    static calculateWinningPercentage(minShowballsNeeded: number, maxShowballsNeeded: number, snowballsLeft: number) {
        if (snowballsLeft < minShowballsNeeded) {
            return 0;
        } else if (snowballsLeft >= maxShowballsNeeded) {
            return 100;
        } else {
            // Calculate the winning percentage based on the range between min and max showballs needed
            const range = maxShowballsNeeded - minShowballsNeeded;
            const snowballsInRange = snowballsLeft - minShowballsNeeded;
            const winningPercentage = (snowballsInRange / range) * 100;

            return winningPercentage;
        }
    }
}