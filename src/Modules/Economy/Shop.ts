import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentBuilder, EmbedBuilder, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { AdvancedClient } from "../../shared";
import { UserDocument } from "../Database/userSchema";
import CONSTANTS from "../../Constants/Constants";

export default class Shop {
    static async execute(client: AdvancedClient, interaction: StringSelectMenuInteraction) {
        if (!interaction.customId.includes('|' + interaction.user.id)) {
            const shopOverview = client.commands.cache.get('shop')?.slash.mention;
            return interaction.reply({ content: `**Please open your own ${shopOverview} overview!**`, ephemeral: true })
        }

        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        const item = interaction.values[0];
        console.log(item);

        if (item === 'attack') {
            return this.viewMenu('attack', client, interaction, user);
        } else if (item === 'collect') {
            return this.viewMenu('collect', client, interaction, user);
        } else if (item === 'storage') {
            return this.viewStorage(interaction, user);
        } else if (item === 'elv') {
            return this.viewElv(interaction, user);
        }
    }

    static async viewItem(client: AdvancedClient, interaction: StringSelectMenuInteraction) {
        const item = CONSTANTS.GAME.ITEMS.find(item => String(item.id) === String(interaction.values[0]));
        if (!item) return interaction.reply({ content: `**This item does not exist anymore!**`, ephemeral: true });

        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        // Check if user has item
        const userItem = user.items.find(i => i.id === item.id);

        const info = [];
        info.push(`**__Item Details:__**`);
        info.push(`${CONSTANTS.EMOJIS.DOT} **Price:** ${"`" + item.price + "`"} ${CONSTANTS.EMOJIS.SNOWBALL}`);
        info.push(`${CONSTANTS.EMOJIS.DOT} **Type:** ${"`" + item.type + "`"}`);
        info.push(`${CONSTANTS.EMOJIS.DOT} **Increase:** ${"`" + item.increase * 100}%` + "`");
        info.push(`${CONSTANTS.EMOJIS.DOT} **Duration:** ${"`" + Math.ceil(item.until / (1000 * 60 * 60)) + "`"} hours`);
        info.push(`${CONSTANTS.EMOJIS.DOT} **You Own:** ${"`" + (userItem?.count || 0) + "`"}`);


        const itemEmbed = new EmbedBuilder()
        itemEmbed.setTitle(item.name);
        itemEmbed.setDescription(item.description + '\n\n' + info.join('\n'));
        itemEmbed.setColor('#8ae2ee');
        itemEmbed.setImage(item.image);

        const components = new ActionRowBuilder<ButtonBuilder>();
        const useButton = new ButtonBuilder();
        useButton.setCustomId(`shopuse|${item.id}`);
        useButton.setLabel('Use');
        useButton.setStyle(ButtonStyle.Secondary);
    /*     useButton.setDisabled((userItem?.count || 0) === 0); */

        const buyButton = new ButtonBuilder();
        buyButton.setCustomId(`shopbuy|${item.id}`);
        buyButton.setLabel('Purchase');
        buyButton.setStyle(ButtonStyle.Primary);
        buyButton.setEmoji(CONSTANTS.EMOJIS.SNOWBALL);

        components.setComponents([useButton, buyButton]);

        return interaction.reply({ embeds: [itemEmbed], components: [components], ephemeral: true });
    }

    static viewMenu(type: 'attack' | 'collect', client: AdvancedClient, interaction: StringSelectMenuInteraction, user: UserDocument) {
        const userItems: string[] = [];
        const shopItems: string[] = [];

        user.items.filter(item => {
            const powerUp = CONSTANTS.GAME.ITEMS.find(i => i.id === item.id);
            return powerUp?.type === type;
        }).filter(item => item.count >= 0).forEach(item => {
            const powerUp = CONSTANTS.GAME.ITEMS.find(i => i.id === item.id)!;
            userItems.push(`**${CONSTANTS.EMOJIS.DOT} ${powerUp.name} - ${"`" + item.count + "`"}**`)
        });

        CONSTANTS.GAME.ITEMS.filter(item => item.type === type).forEach(item => {
            shopItems.push(`**${CONSTANTS.EMOJIS.DOT} ${item.name} - ${"`" + item.price + "`"} ${CONSTANTS.EMOJIS.SNOWBALL}**`)
            shopItems.push(`> ${item.shortDescription}`)
        });

        const itemType = CONSTANTS.GAME.ITEM_TYPES.find(t => t.type === type)!;

        const embed = new EmbedBuilder()
        embed.setTitle(`${itemType.name}`);
        embed.setDescription(`${itemType.description}\n\n**__Your Items:__** ${userItems.length ? "\n" + userItems.join('\n') : "\n> No Items"}`)
        embed.addFields([
            { name: 'Shop', value: shopItems.join('\n') }
        ])
        embed.setColor('#8ae2ee');
        embed.setThumbnail(itemType.image);

        const components = new ActionRowBuilder<StringSelectMenuBuilder>();

        const selectMenu = new StringSelectMenuBuilder();
        selectMenu.setCustomId(`shopitem|${interaction.user.id}`);
        selectMenu.setOptions(CONSTANTS.GAME.ITEMS.filter(item => item.type === type).map(item => {
            return {
                label: item.name,
                value: String(item.id),
                description: item.shortDescription,
            }
        }));

        components.setComponents([selectMenu]);
        return interaction.reply({ embeds: [embed], components: [components], ephemeral: true });
    }

    static viewStorage(interaction: StringSelectMenuInteraction, user: UserDocument) {
        const storageOptions = [];
        storageOptions.push(`**__Upgrade Storage:__**`);

        CONSTANTS.GAME.ITEM.WOODEN_SLEIGH.forEach(sleigh => {
            storageOptions.push(`${CONSTANTS.EMOJIS.DOT} **${sleigh.name} - ${"`" + sleigh.price + "`"} ${CONSTANTS.EMOJIS.SNOWBALL}**`)
            storageOptions.push(`> ${sleigh.description}`)
        });

        const item = CONSTANTS.GAME.ITEM_TYPES.find(t => t.type === 'storage')!;

        const storageEmbed = new EmbedBuilder()
        storageEmbed.setTitle(item.name);
        storageEmbed.setDescription(item.description + '\n\n' + storageOptions.join('\n'));
        storageEmbed.setColor('#ef9b5a');
        storageEmbed.setThumbnail(item.image);

        const components = new ActionRowBuilder<StringSelectMenuBuilder>();
        const selectMenu = new StringSelectMenuBuilder();
        selectMenu.setCustomId(`shopstorage|${interaction.user.id}`);
        selectMenu.setPlaceholder('Select a storage to upgrade');
        selectMenu.setOptions(
            CONSTANTS.GAME.ITEM.WOODEN_SLEIGH.map(sleigh => {
                return {
                    label: sleigh.name,
                    value: String(sleigh.id),
                    description: sleigh.description,
                }
            })
        )

        if (!user.storage.unlocked) {
            const woodenSleigh = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH;
            selectMenu.setOptions([{
                label: woodenSleigh[0].name,
                value: String(woodenSleigh[0].id),
                description: woodenSleigh[0].description,
            }])
        } else {
            const sleigh = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH.find(sleigh => sleigh.capacity === user.storage.capacity)!;
            const index = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH.indexOf(sleigh);
            const nextSleigh = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH[index + 1];
            if (nextSleigh) {
                selectMenu.setOptions([{
                    label: nextSleigh.name,
                    value: String(nextSleigh.id),
                    description: nextSleigh.description,
                }])
            } else {
                selectMenu.setDisabled(true);
            }
        }

        components.setComponents([selectMenu]);

        return interaction.reply({ embeds: [storageEmbed], components: [components], ephemeral: true });
    }

    static viewElv(interaction: StringSelectMenuInteraction, user: UserDocument) {
        const item = CONSTANTS.GAME.ITEM_TYPES.find(t => t.type === 'elv')!;
    
        const elvDetails = [];
        const userDetails = [];
        elvDetails.push(`${CONSTANTS.EMOJIS.DOT} **Price:** ${"`" + this.calculateElvPrice(user) + "`"} ${CONSTANTS.EMOJIS.SNOWBALL}`);
        elvDetails.push(`${CONSTANTS.EMOJIS.DOT} **Snowballs/h:** ${"`" + 10 + "`"} ${CONSTANTS.EMOJIS.SNOWBALL}`);

        const nextCollectableAt = user.lastCollectedAt ? new Date(user.lastCollectedAt.getTime() + 60 * 60 * 1000).getTime() : (new Date().getTime() - 60 * 60 * 1000);
        
        
        userDetails.push(`${CONSTANTS.EMOJIS.DOT} **You hired:** ${"`" + user.elvesCount + "`"} elves`);
        userDetails.push(`${CONSTANTS.EMOJIS.DOT} **Your production per hour:** ${"`" + 10*user.elvesCount + "`"} ${CONSTANTS.EMOJIS.SNOWBALL}`);
        userDetails.push(`${CONSTANTS.EMOJIS.DOT} **Next collectable:** ${CONSTANTS.GAME.timeOf(nextCollectableAt)}`);

        const elvEmbed = new EmbedBuilder()
        elvEmbed.setTitle("Hire " + item.name);
        elvEmbed.setDescription(item.description);
        elvEmbed.addFields([
            { name: 'Your Elves', value: userDetails.join('\n'), inline: true },
            { name: 'Recruit Elf', value: elvDetails.join('\n'), inline: true },
        ])
        elvEmbed.setColor('#49aa9f');
        elvEmbed.setImage(CONSTANTS.IMAGES.SANTA_SNOWBALL);

        const components = new ActionRowBuilder<ButtonBuilder>();
        const buyButton = new ButtonBuilder();
        buyButton.setCustomId(`shopelv|`);
        buyButton.setLabel('Purchase');
        buyButton.setStyle(ButtonStyle.Primary);
        buyButton.setEmoji(CONSTANTS.EMOJIS.SNOWBALL);

        components.setComponents([buyButton]);

        return interaction.reply({ embeds: [elvEmbed], components: [components], ephemeral: true });
    }

    static purchaseElv(client: AdvancedClient, interaction: ButtonInteraction) {
        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        const item = CONSTANTS.GAME.ITEM_TYPES.find(t => t.type === 'elv')!;
        const price = this.calculateElvPrice(user);
        const missingDiff = price - user.snowBallAmount;
        if (missingDiff > 0) return interaction.reply({ content: `**You are missing ${"`" + missingDiff + "`"} ${CONSTANTS.EMOJIS.SNOWBALL} to hire an elf | Feel free to ${client.commands.cache.get('collect')?.slash.mention} some!**`, ephemeral: true });

        user.snowBallAmount -= price;
        user.elvesCount++;

        const updatedUser = client.userManager.update(user);
        if (!updatedUser) return interaction.reply({ content: `**Something went wrong while hiring an elf!**`, ephemeral: true });

        const itemEmbed = new EmbedBuilder(CONSTANTS.GAME.SHOP.ELV_HIRE.embed());
        itemEmbed.setColor('#91e2ef');
        return interaction.reply({ embeds: [itemEmbed], ephemeral: true });
    }

    static calculateElvPrice(user: UserDocument) {
        const baseProduction = 10*user.elvesCount;
        const basePrice = baseProduction*6;
        const price = Math.ceil(basePrice*1.1);
        return price;
    }

    static async upgradeStorage(client: AdvancedClient, interaction: StringSelectMenuInteraction) {
        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        const item = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH.find(sleigh => String(sleigh.id) === String(interaction.values[0]));
        if (!item) return interaction.reply({ content: `**This item does not exist anymore!**`, ephemeral: true });

        if (user.storage.unlocked) {
            const sleigh = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH.find(sleigh => sleigh.capacity === user.storage.capacity)!;
            const index = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH.indexOf(sleigh);
            const nextSleigh = CONSTANTS.GAME.ITEM.WOODEN_SLEIGH[index + 1];
            if (!nextSleigh) return interaction.reply({ content: `**You already have a higher upgraded wooden sleigh**`, ephemeral: true });
        }

        const findCommand = client.commands.cache.get('find')?.slash.mention!;
        const collectCommand = client.commands.cache.get('collect')?.slash.mention!;

        const missingDiff = item.price - user.snowBallAmount;
        if (missingDiff > 0) return interaction.reply({ content: `**You are missing ${"`" + missingDiff + "`"} ${CONSTANTS.EMOJIS.SNOWBALL} to upgrade your storage | Feel free to ${collectCommand} or ${findCommand} some!**`, ephemeral: true });

        user.snowBallAmount -= item.price;
        user.storage.unlocked = true;
        user.storage.capacity = item.capacity;

        const updatedUser = await client.userManager.update(user);
        if (!updatedUser) return interaction.reply({ content: `**Something went wrong while upgrading your storage!**`, ephemeral: true });

        const itemEmbed = new EmbedBuilder()
        itemEmbed.setTitle(item.name);
        itemEmbed.setDescription(`**Your storage has a capacity of ${"`" + item.capacity + "`"} now!**`);
        itemEmbed.setColor('#ef9b5a');
        itemEmbed.setThumbnail(CONSTANTS.IMAGES.ITEMS_WOODEN_SLEIGH);

        return interaction.reply({ embeds: [itemEmbed], ephemeral: true });
    }

    static purchaseItem(client: AdvancedClient, interaction: ButtonInteraction) {
        const item = CONSTANTS.GAME.ITEMS.find(item => String(item.id) === String(interaction.customId.split('|')[1]));
        if (!item) return interaction.reply({ content: `**This item does not exist anymore!**`, ephemeral: true });

        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        const userItem = user.items.find(i => i.id === item.id);
        if (userItem) {
            userItem.count++;
            // Update user items
            user.items = user.items.map(i => {
                if (i.id === item.id) {
                    return {
                        id: item.id,
                        count: userItem.count,
                    }
                }
                return i;
            })
        } else {
            user.items.push({
                id: item.id,
                count: 1,
            })
        }

        user.snowBallAmount -= item.price;

        const updatedUser = client.userManager.update(user);
        if (!updatedUser) return interaction.reply({ content: `**Something went wrong while purchasing this item!**`, ephemeral: true });

        return interaction.reply({ content: `**You purchased ${"`" + item.name + "`"} for ${"`" + item.price + "`"} ${CONSTANTS.EMOJIS.SNOWBALL} | Go to the Shop to activate it!**`, ephemeral: true });
    }

    static useItem(client: AdvancedClient, interaction: ButtonInteraction) {
        const item = CONSTANTS.GAME.ITEMS.find(item => String(item.id) === String(interaction.customId.split('|')[1]));
        if (!item) return interaction.reply({ content: `**This item does not exist anymore!**`, ephemeral: true });

        const user = client.userManager.cache.get(interaction.user.id);
        if (!user) {
            const startCommand = client.commands.cache.get('start')?.slash.mention;
            return interaction.reply({ content: `**Please start your journey with ${startCommand}!**`, ephemeral: true })
        }

        const userItem = user.items.find(i => i.id === item.id)!;
        if(!userItem) return interaction.reply({ content: `**You do not own this item | Please purchase it on the Shop!**`, ephemeral: true });
        if (userItem.count <= 0) return interaction.reply({ content: `**You do not own this item | Please purchase it on the Shop!**`, ephemeral: true });

        const powerUp = CONSTANTS.GAME.ITEMS.find(i => i.id === item.id)!;
        const powerUpIndex = user.powerUps.findIndex(p => p.id === powerUp.id);

        if(powerUpIndex > -1 && user.powerUps[powerUpIndex].until > new Date()) {
            const time = CONSTANTS.GAME.timeOf(user.powerUps[powerUpIndex].until.getTime());
            return interaction.reply({ content: `**You already have this power up active until ${time}!**`, ephemeral: true });
        }

        if (powerUpIndex > -1) {
            user.powerUps[powerUpIndex].until = new Date(user.powerUps[powerUpIndex].until.getTime() + powerUp.until);
        } else {
            user.powerUps.push({
                id: powerUp.id,
                until: new Date(new Date().getTime() + powerUp.until),
            })
        }

        // Update user items
        user.items = user.items.map(i => {
            if (i.id === item.id) {
                return {
                    id: item.id,
                    count: userItem.count - 1,
                }
            }
            return i;
        })

        const updatedUser = client.userManager.update(user);
        if (!updatedUser) return interaction.reply({ content: `**Something went wrong while using this item!**`, ephemeral: true });

        return interaction.reply({ content: `**You used ${"`" + item.name + "`"} | Collect, find or attack to see the effects!**`, ephemeral: true });
    }
}