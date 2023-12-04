import { ActionRowBuilder, ColorResolvable, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";

const IMAGES = {
    SANTA_SNOWBALL: "https://cdn.discordapp.com/attachments/1180590767983566869/1180590886946623588/Main_Background.png",
    SANTA_DEFEATED: "https://cdn.discordapp.com/attachments/1180590767983566869/1180982422423228528/defated.png",
    SANTA_ENDING: "https://cdn.discordapp.com/attachments/1180590767983566869/1180982387631464510/ending.png",
    SANTA_GIFTS: "https://cdn.discordapp.com/attachments/1180590767983566869/1180982529138888805/gift_success_retrieved.png",
    PLAYER_FIGHT: "https://cdn.discordapp.com/attachments/1180590767983566869/1180982571786571929/snowball_fight.png",
    CARD_LEADERBOARD: "",
    CARD_MAP: "https://cdn.discordapp.com/attachments/1180590767983566869/1180627266846339072/Map.png",
    ITEMS_GIFT_TRACKER: "https://cdn.discordapp.com/attachments/1180590767983566869/1180627223431098408/Gift_Tracker.png",
    ITEMS_SNOWBALL: "https://cdn.discordapp.com/attachments/1180590767983566869/1180969194439839864/snowball.png",
    ITEMS_PORTIONS: "https://cdn.discordapp.com/attachments/1180590767983566869/1180982613373091871/portions.png",
    ITEMS_WOODEN_SLEIGH: "https://cdn.discordapp.com/attachments/1180590767983566869/1180982290969546873/wooden_sleigh.png",
    ITEMS_POWERUP_INCREASE: "https://cdn.discordapp.com/attachments/1180590767983566869/1181300212061458532/7.png",
    ITEMS_POWERUP_FORCE: "https://cdn.discordapp.com/attachments/1180590767983566869/1181300210492776548/8.png",
    ITEMS_POWERUP_LUCK: "https://cdn.discordapp.com/attachments/1180590767983566869/1181300210882842745/9.png",
    ITEMS_POWERUP_DUPLICATE: "https://cdn.discordapp.com/attachments/1180590767983566869/1181300211230986260/10.png",
    ITEMS_POWERUP_REGAIN: "https://cdn.discordapp.com/attachments/1180590767983566869/1181300211579097099/11.png",
    MONSTER_LEADER: "",
    MONSTER_1: "",
    MONSTER_2: "",
    MONSTER_3: "",
    MONSTER_4: "",
    MONSTER_5: "",
    MONSTER_6: "",
    MONSTER_7: "",
    MONSTER_8: "",
    MONSTER_9: "",
    MONSTER_10: "",
    MONSTER_11: "",
    MONSTER_12: "",
    MONSTER_13: "",
    MONSTER_14: "",
    MONSTER_15: "",
    MONSTER_16: "",
    MONSTER_17: "",
}

const EMOJIS = {
    DOT: '<:dot:1181282197588693103>',
    SNOWBALL: '<:snowballemoji:1181292277755302008>',
    ELV: '<:elvemoji:1181298122694086686>',
    ATTACK: '<:attackemoji:1181297626575028375>',
    COLLECT: '<:collectemoji:1181297792078061689>',
    SLEIGH: '<:sleighemoji:1181297953407778866>',
}

const START = {
    embed: (claimCommand: string): EmbedBuilder['data'] => ({
        title: "Santa's Christmas Quest: Save the Presents!",
        description:
            [
                "'Twas the night before Christmas, and all was calm until disaster struck. ",
                "The notorious **Frostbite the Frozen**, a formidable ice wizard, led a **raid on Santa's gift facility** on the **7th of December**. ",
                "With chilling precision, **Frostbite** and his **band of 18 monsters seized all** the carefully wrapped **presents** meant for children worldwide.\n",
                "With all the presents stolen **Christmas is on the line**, and **Santa's last hope** lies in an unlikely hero - **YOU**!\n\n",
                "The magical device, **Gift Finder 3000**, created by the ingenious elves, reveals that the presents are scattered across the globe, hidden in various locations. ",
                "However, Santa can't face the menacing monsters alone. ",
                "He needs **your assistance to collect** magical snowballs called **Blizzard Balls**, the only weapon capable of defeating these icy adversaries.\n\n",
                "Thankfully, the Christmas elves are tirelessly working to collect 10 snowballs per hour. ",
                "But **Santa needs more firepower** to reclaim the stolen gifts. ",
                `That's where you come in. \n**Join the quest, ${claimCommand} the Gift Finder 3000, and help Santa deliver joy to children around the world!**`,
            ].join(""),
        image: {
            url: IMAGES.SANTA_SNOWBALL,
        },
    }),
}

const CLAIM = {
    embed: (collectCommand: string, findCommand: string, prepareCommand: string): EmbedBuilder['data'] => ({
        title: "Claimed the Gift Finder 3000",
        description:
            [
                "As you claim the **Gift Tracker 3000**, a surge of festive energy envelops you. ",
                "The device, adorned with intricate elven runes, hums to life, projecting **a holographic globe mapping** the **possible locations of the stolen gifts**.\n\n",
                "**To defeat the monsters** and save Christmas, your journey begins with collecting **magical snowballs called Blizzard Balls**.",
                `Use the **${collectCommand}** command to **collect Blizzard Balls** every hour from the hardworking elves and **${findCommand} to find some yourself**.\n`,
                `When you feel adequately prepared, ready yourself for the impending battle with **${prepareCommand}**. `,
                "There, you will discover valuable information about the attack-able locations and embark on the quest to retrieve the gifts back.",
            ].join(""),
        image: {
            url: IMAGES.CARD_MAP,
        },
        thumbnail: {
            url: IMAGES.ITEMS_GIFT_TRACKER,
        },
    }),
}

const COLLECT = {
    embed: (
        snowBallAmount: number,
        powerUps: string,
        findCommand: string,
        fightCommand: string,
        shopCommand: string
    ): EmbedBuilder['data'] => ({
        title: "Collected Blizzard Balls",
        description:
            [
                `**You joyfully collect ${"`" + snowBallAmount + "`"} magical snowballs** from the industrious Christmas elves.\n`,
                (
                    powerUps.length > 0
                        ? `\n**__Following power-ups are activated:__**\n${powerUps}\n`
                        : "To give the elves a power-up. Buy some from the **" + shopCommand + "**.\n\n"
                ),
                `Venture into the winter realm and ${findCommand} for hidden snowball caches `,
                `or unleash your competitive spirit by challenging other fellow players through a ${fightCommand}.`

            ].join(""),
        image: {
            url: IMAGES.SANTA_SNOWBALL,
        },
    }),
}

const FIND = {
    embed: (snowBallAmount: number, powerUps: string, shopCommand: string, collectCommand: string, fightCommand: string): EmbedBuilder['data'] => {
        const randomFindLocations = [
            "Uncovered a stash of {{amount}} glittering snowballs!",
            "Discovered {{amount}} magical snowballs in the frosty hideout.",
            "A festive surprise! Found {{amount}} enchanting snowballs.",
            "Your keen eyes spot {{amount}} gleaming snowballs nearby.",
            "{{amount}} sparkling snowballs revealed in the wintry landscape.",
            "A serendipitous moment! Snagged {{amount}} radiant snowballs.",
            "The frosty trail leads to {{amount}} hidden, shimmering snowballs.",
            "Behold! {{amount}} charming snowballs unearthed in the snowscape.",
            "On your snowball treasure hunt you have found {{amount}} glittering orbs.",
            "The snowy landscape yields a bounty of {{amount}} magical snowballs.",
            "Gathered {{amount}} gleaming snowballs with a touch of holiday magic.",
            "A wintery jackpot! Collected {{amount}} enchanting snowballs.",
            "{{amount}} snowballs, a splendid find in this winter wonderland.",
            "The search pays off! Acquired {{amount}} dazzling snowballs.",
            "In the snow-kissed corners, found {{amount}} whimsical snowballs.",
            "{{amount}} radiant snowballs surfaced in the heart of the frost.",
            "Beneath the frosty veil, discovered a trove of {{amount}} snowballs.",
            "The snow whispers secrets, leading to {{amount}} sparkling snowballs.",
            "Found a cache of {{amount}} magical snowballs in the icy expanse.",
        ]

        const randomFindLocation = randomFindLocations[Math.floor(Math.random() * randomFindLocations.length)].replace("{{amount}}", "`" + snowBallAmount + "`");

        return {
            title: "Found Blizzard Balls",
            description:
                [
                    randomFindLocation + "\n",
                    (
                        powerUps.length > 0
                            ? `\n**__Following power-ups are activated:__**\n${powerUps}\n\n`
                            : "To get some power-ups. Buy some from the " + shopCommand + ".\n\n"
                    ),
                    "Collect more snowballs from the hardworking elves by using " + collectCommand + " " +
                    "or unleash your competitive spirit by challenging other fellow players through a " + fightCommand + "."
                ].join(""),
            thumbnail: {
                url: IMAGES.ITEMS_SNOWBALL
            },
        }
    }
}

// @TODO - Add more snowballs
const ITEM_TYPES = [
    {
        type: "attack",
        name: "Attack Portions",
        description: "Bolster your snowball assault! Attack Portions crank up your festive fury, " +
            "dealing extra damage to the icy adversaries. Unleash a blizzard of power with every throw!",
        shortDescription: "Attack Portions crank up your festive fury, dealing extra damage to the icy adversaries.",
        emoji: EMOJIS.ATTACK,
        image: IMAGES.ITEMS_POWERUP_FORCE,
    },
    {
        type: "collect",
        name: "Collect Portions/Items",
        description: "Amplify your snowball gathering process! " +
            "Collect Portions increased the amount of snowballs collected on search's and collect's, " +
            "ensuring each interaction with the Christmas elves yields an even more bountiful harvest of magical snowballs.",
        shortDescription: "Collect Portions increases the amount of snowballs collected on search's and collect's.",
        emoji: EMOJIS.COLLECT,
        image: IMAGES.ITEMS_POWERUP_INCREASE,
    },
    {
        type: "storage",
        name: "Wooden Sleigh",
        description: "Upgrade your trusty Wooden Sleigh to transport more snowballs to the battlefront, turning your chances for a frosty triumph.",
        shortDescription: "Upgrade your trusty Wooden Sleigh to transport more snowballs to the battlefront.",
        emoji: EMOJIS.SLEIGH,
        image: IMAGES.ITEMS_WOODEN_SLEIGH,
    },
    {
        type: "elv",
        name: "Elves",
        description: "Recruit helpful Christmas Elves! Hire these festive assistants to amplify your snowball collection. " +
            "With more elves, your quest becomes a symphony of efficiency, ensuring no snowball is left uncollected.",
        shortDescription: "Hire these festive assistants to amplify your snowball collection.",
        emoji: EMOJIS.ELV,
        image: IMAGES.ITEMS_POWERUP_DUPLICATE,
    }
]

const WOODEN_SLEIGH = [
    { id: 0, capacity: 25, price: 30, name: "Unlock Wooden Sleigh", description: "A basic Wooden Sleigh with a modest storage capacity of 25 snowballs." },
    { id: 1, capacity: 50, price: 60, name: "Frosty Cruiser", description: "A basic Wooden Sleigh with a modest storage capacity of 50 snowballs." },
    { id: 2, capacity: 100, price: 120, name: "Snowflake Hauler", description: "Upgraded Wooden Sleigh, now with an increased storage capacity of 100 snowballs." },
    { id: 3, capacity: 200, price: 240, name: "Icicle Transporter", description: "Advanced Wooden Sleigh, boasting a storage capacity of 200 snowballs." },
    { id: 4, capacity: 425, price: 480, name: "Blizzard Conveyance", description: "Mastercrafted Wooden Sleigh, offering an impressive storage of 425 snowballs." },
    { id: 5, capacity: 600, price: 1000, name: "Aurora Carrier", description: "Legendary Wooden Sleigh to transport a massive amount of 600 snowballs." }
]

const SHOP = {
    MENU: {
        embed: (): EmbedBuilder['data'] => ({
            title: "Santa's Workshop",
            description:
                [
                    "Acquire potent Power-Up Portions, discover mystical Items, recruit additional Christmas Elves, " +
                    "or unlock the ability to upgrade your trusty Wooden Sleigh, transforming it into a snowball-hoarding marvel\n\n",
                    "**__Available Items:__**\n",
                    ITEM_TYPES.map((item) => {
                        return [
                            `${EMOJIS.DOT} **${item.name}**`,
                            /* `> ${item.description}\n`, */
                        ].join("");
                    }).join("\n"),
                ].join(""),
            thumbnail: {
                url: IMAGES.ITEMS_PORTIONS,
            },
        }),
        component: (userId: string): ActionRowBuilder<StringSelectMenuBuilder> => {
            const components = new ActionRowBuilder<StringSelectMenuBuilder>();
            const selectMenu = new StringSelectMenuBuilder();
            selectMenu.setCustomId(`shop|${userId}`);
            selectMenu.setPlaceholder("Select an item to get more information");
            selectMenu.addOptions(
                ITEM_TYPES.map((item) => {
                    return {
                        label: item.name,
                        description: item.shortDescription,
                        value: item.type,
                        emoji: item.emoji,
                    }
                })
            );
            components.addComponents(selectMenu);
            return components;
        }
    },
    ELV_HIRE: {
        embed: (): EmbedBuilder['data'] => ({
            title: "Hired Christmas Elves",
            description: "You've enlisted a cheerful Christmas Elf! With their help, your snowball collection is bound to reach new heights. Welcome your festive assistant to the team!",
            thumbnail: {
                url: IMAGES.ITEMS_POWERUP_DUPLICATE,
            },
        })
    }
}

const ITEMS = [
    {
        id: 0,
        type: "collect",
        form: "portion",
        name: "Snowflurry Elixir",
        target: 'player',
        description: "A sip of the Snowflurry Elixir grants 20% more snowballs, intensifying the festive magic coursing through your veins. "
            + "With each collected snowball, the essence of the season grows more potent. The effects of the Snowflurry Elixir will last for 12 hours.",
        shortDescription: "A sip of the Snowflurry Elixir grants 20% more snowballs.",
        price: 20,
        increase: 0.2,
        until: 12 * 60 * 60 * 1000,
        image: IMAGES.ITEMS_POWERUP_INCREASE,
    },
    {
        id: 1,
        type: "attack",
        form: "portion",
        name: "Frostbite Fury Tonic",
        description: "Drink the Frostbite Fury Tonic to infuse your attacks with an extra 25% punch, turning each snowball into a formidable force against the icy monsters. "
            + "Unleash a blizzard of power and let the Frostbite Fury guide your triumph. "
            + "The effects of the Frostbite Fury Tonic will last for 3 hours.",
        target: 'monster',
        shortDescription: "Drink the Frostbite Fury Tonic to infuse your attacks with an extra 25% punch.",
        price: 35,
        increase: 0.25,
        until: 3 * 60 * 60 * 1000,
        image: IMAGES.ITEMS_POWERUP_FORCE,
    },
    {
        id: 2,
        type: "collect",
        form: "item",
        name: "Lucky Blizzard Charm",
        description: "Equip the Lucky Blizzard Charm to increase your chances of uncovering hidden snowballs by a remarkable 50%. " +
            "Luck becomes your ally as you tread through the snowy landscapes, revealing the hidden bounty of the winter wonderland. " +
            "Effect of the Lucky Blizzard Charm will last for 24 hours.",
        shortDescription: "Increase your chances of uncovering hidden snowballs by a remarkable 50%.",
        target: 'player',
        price: 50,
        increase: 0.5,
        until: 24 * 60 * 60 * 1000,
        image: IMAGES.ITEMS_POWERUP_LUCK,
    },
    {
        id: 3,
        type: "collect",
        form: "item",
        name: "Elfusion Ephemera",
        description: "Activate the Elfusion Ephemera, and witness the manifestation of duplicated elves, amplifying your workforce twofold. " +
            "Combine it strategically with the Snowflurry Elixir for an unrivaled surge in both elves and finding snowballs, ushering in a blizzard of efficiency. " +
            "Effect of the Elfusion Ephemera will last for 24 hours.",
        shortDescription: "Witness the manifestation of duplicated elves, amplifying your workforce twofold.",
        target: 'elf',
        price: 75,
        increase: 1,
        until: 24 * 60 * 60 * 1000,
        image: IMAGES.ITEMS_POWERUP_DUPLICATE,
    },
    {
        id: 4,
        type: "attack",
        form: "portion",
        name: "Glacial Revival Elixir",
        description: "Before engaging in a frosty clash, consume the Glacial Revival Elixir. " +
            "It ensures that 50% of your lost snowballs gracefully return to your arsenal after each victorious battle, " +
            "reviving your spirits and fortifying your resolve for the battles that lie ahead. " +
            "Effect of the Glacial Revival Elixir will last for 3 hours.",
        shortDescription: "Ensures that 50% of your lost snowballs gracefully return to your arsenal after each battle.",
        target: 'player',
        price: 100,
        increase: 0.5,
        until: 3 * 60 * 60 * 1000,
        image: IMAGES.ITEMS_POWERUP_REGAIN,
    }
]

const LOCATIONS = [
    {
        id: 0,
        name: "North Pole",
        monsterId: 0,
        giftCount: 120,
    }
];

function timeOf(time: number) {
    return `<t:${Math.ceil(time / 1000)}:R>`;
}

const CONSTANTS = {
    IMAGES,
    EMOJIS,
    GAME: {
        timeOf,
        START,
        CLAIM,
        COLLECT,
        ITEM: {
            WOODEN_SLEIGH,
        },
        ITEMS,
        ITEM_TYPES,
        FIND,
        SHOP,
        LOCATIONS,
        /*       END,
              MONSTERS,
              CARDS */
    }
};

export default CONSTANTS;