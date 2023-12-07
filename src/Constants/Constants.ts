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
    MONSTER_LEADER: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686153913569320/18.jpg",
    MONSTER_0: "https://cdn.discordapp.com/attachments/1180590767983566869/1181685884731523173/1.jpg",
    MONSTER_1: "https://cdn.discordapp.com/attachments/1180590767983566869/1181685885570400396/2.jpg",
    MONSTER_2: "https://cdn.discordapp.com/attachments/1180590767983566869/1181685886484762765/3.jpg",
    MONSTER_3: "https://cdn.discordapp.com/attachments/1180590767983566869/1181685887361351680/4.jpg",
    MONSTER_4: "https://cdn.discordapp.com/attachments/1180590767983566869/1181685998095171645/5.jpg",
    MONSTER_5: "https://cdn.discordapp.com/attachments/1180590767983566869/1181685998938234972/6.jpg",
    MONSTER_6: "https://cdn.discordapp.com/attachments/1180590767983566869/1181685999827435690/7.jpg",
    MONSTER_7: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686000758554685/8.jpg",
    MONSTER_8: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686056660242652/9.jpg",
    MONSTER_9: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686057423614043/10.jpg",
    MONSTER_10: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686058757398588/11.jpg",
    MONSTER_11: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686059562709093/12.jpg",
    MONSTER_12: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686102503981056/13.jpg",
    MONSTER_13: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686103464488993/14.jpg",
    MONSTER_14: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686104307531837/15.jpg",
    MONSTER_15: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686105440002149/16.jpg",
    MONSTER_16: "https://cdn.discordapp.com/attachments/1180590767983566869/1181686152990826558/17.jpg",
}

const SNOWBALL = {
    damage: {
        min: 7,
        max: 22,
    }
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
        shopCommand: string
    ): EmbedBuilder['data'] => ({
        title: "Collected Blizzard Balls",
        description:
            [
                `**You joyfully collect ${"`" + snowBallAmount + "`"} magical snowballs** from the industrious Christmas elves.\n`,
                (
                    powerUps.length > 0
                        ? `\n**__Following power-ups are activated:__**\n${powerUps}\n\n`
                        : "To give the elves a power-up. Buy some from the **" + shopCommand + ".**\n\n"
                ),
                `Venture into the winter realm and ${findCommand} for hidden snowball caches. `,

            ].join(""),
        image: {
            url: IMAGES.SANTA_SNOWBALL,
        },
    }),
}

const FIND = {
    embed: (snowBallAmount: number, powerUps: string, shopCommand: string, collectCommand: string): EmbedBuilder['data'] => {
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
                    "Collect more snowballs from the hardworking elves by using " + collectCommand + ".",
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
    { id: 0, capacity: 25, price: 50, name: "Unlock Wooden Sleigh", description: "A basic Wooden Sleigh with a modest storage capacity of 25 snowballs." },
    { id: 1, capacity: 50, price: 125, name: "Frosty Cruiser", description: "A basic Wooden Sleigh with a modest storage capacity of 50 snowballs." },
    { id: 2, capacity: 100, price: 225, name: "Snowflake Hauler", description: "Upgraded Wooden Sleigh, now with an increased storage capacity of 100 snowballs." },
    { id: 3, capacity: 200, price: 420, name: "Icicle Transporter", description: "Advanced Wooden Sleigh, boasting a storage capacity of 200 snowballs." },
    { id: 4, capacity: 425, price: 955, name: "Blizzard Conveyance", description: "Mastercrafted Wooden Sleigh, offering an impressive storage of 425 snowballs." },
    { id: 5, capacity: 600, price: 1500, name: "Aurora Carrier", description: "Legendary Wooden Sleigh to transport a massive amount of 600 snowballs." }
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

const MONSTERS = [
    {
        id: 0,
        name: "Blizzardclaw, the Icy Behemoth",
        shortName: "Blizzardclaw",
        xp: 250,
        image: IMAGES.MONSTER_0,
        description: "Behold Blizzardclaw, the Icy Behemoth! Towering and relentless, its crystalline fur shimmers with an arctic glow. " +
            "Strength lies in mighty icicle swipes. However, this frozen giant crumbles against a barrage of enchanted snowballs, revealing its vulnerability.",
        shortDescription: "Arctic titan, Blizzardclaw, commands icy terror. Defeat with relentless snowball assault!",
        attackMessages: [
            "Blizzardclaw looms over you, ready to unleash its icy wrath!",
            "The Arctic titan, Blizzardclaw, swipes at you with mighty icicles!",
            "Icicle-laden fur bristles as Blizzardclaw prepares a chilling attack!",
            "Snowflakes dance around Blizzardclaw as it readies an arctic onslaught!",
            "Blizzardclaw's crystalline fur gleams ominously before the impending strike!",
            "You feel the frosty presence of Blizzardclaw intensify as it prepares an icy assault!",
            "Mighty icicles form in the wake of Blizzardclaw's impending attack!",
            "Blizzardclaw unleashes a flurry of chilling swipes in your direction!",
            "The arctic glow surrounding Blizzardclaw signals a fierce icicle onslaught!",
            "You face the chilling might of Blizzardclaw as it lunges forward with icy intent!"
        ],
    }, {
        id: 1,
        name: "Glacial Gloom, the Arctic Harbinger",
        shortName: "Glacial Gloom",
        xp: 450,
        image: IMAGES.MONSTER_1,
        shortDescription: "Icy specter, Glacial Gloom, haunts with chilling curses. Banish it with a flurry of snowballs!",
        description: "Encounter Glacial Gloom, the Arctic Harbinger, a ghostly wraith draped in frigid shadows. " +
            "Its strength lies in chilling curses, but beneath the icy facade, " +
            "vulnerability emerges when bombarded with enchanted snowballs—a spectral weakness waiting to be exploited.",
        attackMessages: [
            "Glacial Gloom's icy presence surrounds you, heralding a spectral attack!",
            "The Arctic Harbinger, Glacial Gloom, whispers chilling curses in your direction!",
            "Fractured shadows dance as Glacial Gloom prepares a spectral onslaught!",
            "A ghostly shiver signals Glacial Gloom's approach, ready to unleash chilling curses!",
            "The icy specter, Glacial Gloom, conjures a haunting aura before its ethereal attack!",
            "You feel the chilling touch of Glacial Gloom's curses intensify as it readies a spectral assault!",
            "Chilled whispers fill the air as Glacial Gloom prepares to unleash its icy curses!",
            "Glacial Gloom's frigid shadows coalesce, forming the prelude to a spectral strike!",
            "A haunting aura envelops you as Glacial Gloom conjures its chilling curses!",
            "Prepare for the spectral might of Glacial Gloom as it haunts with icy curses!"
        ],
    }, {
        id: 2,
        name: "Snowspecter, the Chilling Apparition",
        shortName: "Snowspecter",
        xp: 525,
        image: IMAGES.MONSTER_2,
        shortDescription: "Snowspecter, a boneless phantom, wails with icy dread. Dispel its haunting presence with snowball barrages!",
        description: "Confront Snowspecter, the Chilling Apparition — a ghostly entity formed of frozen tissues. " +
            "Swift and ethereal, its strength lies in bone-chilling wails. " +
            "Unveil its spectral weakness by bombarding with enchanted snowballs, disrupting its incorporeal form.",
        attackMessages: [
            "You feel the icy dread as Snowspecter, the Chilling Apparition, materializes before you!",
            "The boneless phantom, Snowspecter, directs bone-chilling wails toward you!",
            "Prepare for the haunting presence of Snowspecter as it wails with icy dread!",
            "A ghostly shiver runs down your spine as Snowspecter readies its chilling assault!",
            "Snowspecter, the Chilling Apparition, unleashes an ethereal wail directed at you!",
            "Icy tissues shimmer as Snowspecter, the boneless phantom, manifests its chilling aura!",
            "The spectral might of Snowspecter targets you with bone-chilling wails!",
            "Frozen tissues coalesce as Snowspecter intensifies its ethereal form, ready to attack you!",
            "You face the haunting wails of Snowspecter, the Chilling Apparition!",
            "Unleash enchanted snowballs to disrupt the incorporeal form of Snowspecter and banish its chilling presence!"
        ]
    }, {
        id: 3,
        name: "Avalanche Avenger, the Frost Fury",
        shortName: "Avalanche Avenger",
        xp: 675,
        image: IMAGES.MONSTER_3,
        shortDescription: "Frost Fury, Avalanche Avenger, commands icy wrath. "
            + "Unleash enchanted snowballs to quell the frozen tempest",
        description: "Prepare to face the Avalanche Avenger, the Frost Fury — a colossal force of frozen rage. " +
            "Mighty avalanches fuel its strength. However, a relentless barrage of enchanted snowballs unveils its Achilles' heel, melting the icy wrath away.",
        attackMessages: [
            "The Frost Fury, Avalanche Avenger, directs the icy tempest towards you!",
            "A colossal force of frozen rage, Avalanche Avenger, readies its frigid assault!",
            "Feel the might of the frozen tempest as Avalanche Avenger commands its icy wrath!",
            "Prepare for the onslaught of the Frost Fury, Avalanche Avenger, fueled by mighty avalanches!",
            "Avalanche Avenger unleashes a frozen tempest, directing its icy rage at you!",
            "You face the colossal force of Avalanche Avenger as it readies a frigid assault!",
            "The icy wrath of Avalanche Avenger intensifies as it commands the frozen tempest!",
            "Mighty avalanches fuel the frozen rage of Avalanche Avenger, directed at you!",
            "Prepare to confront the Frost Fury, Avalanche Avenger, and quell its icy wrath with enchanted snowballs!",
            "Unleash enchanted snowballs to melt away the icy wrath of Avalanche Avenger, the Frost Fury!"
        ],
    }, {
        id: 4,
        name: "Frostfang, the Arctic Serpent",
        shortName: "Frostfang",
        xp: 750,
        image: IMAGES.MONSTER_4,
        shortDescription: "Arctic Serpent, Frostfang, hisses with glacial venom. " +
            "Uncoil its icy grip with a flurry of enchanted snowballs!",
        description: "Behold Frostfang, the Arctic Serpent — a sinuous embodiment of frost. " +
            "Coiled in icy splendor, its strength lies in glacial venom. " +
            "Harness its weakness by bombarding with enchanted snowballs, thawing the serpentine menace in a cascade of frosty defeat.",
        attackMessages: [
            "The Arctic Serpent, Frostfang, hisses as it prepares to unleash glacial venom upon you!",
            "Frostfang, the sinuous embodiment of frost, readies its icy grip to ensnare you!",
            "Feel the chill of Frostfang's glacial venom as the Arctic Serpent prepares to strike!",
            "Coiled in icy splendor, Frostfang hisses, directing its glacial venom your way!",
            "You face the sinuous menace of Frostfang, the Arctic Serpent, as it readies its icy grip!",
            "Prepare for the glacial venom of Frostfang as the serpentine creature prepares to strike!",
            "Frostfang, the Arctic Serpent, intensifies its icy grip, ready to unleash glacial venom!",
            "The sinuous embodiment of frost, Frostfang, directs its glacial venom towards you!",
            "Feel the Arctic Serpent's icy grip tighten as Frostfang hisses with glacial venom!",
            "Uncoil Frostfang's icy grip with a relentless flurry of enchanted snowballs, thawing the serpentine menace in a cascade of frosty defeat!"
        ]
    }, {
        id: 5,
        name: "Hailstorm Howler, the Frigid Fiend",
        shortName: "Hailstorm Howler",
        xp: 1000,
        image: IMAGES.MONSTER_5,
        shortDescription: "Frigid Fiend, Hailstorm Howler, disguises danger. Shatter its icy guise with a storm of enchanted snowballs!",
        description: "Confront the Hailstorm Howler, the Frigid Fiend — a deceptively normal wolf with an arctic secret. "
            + "Its strength lies in swift attacks and bone-chilling howls. " +
            "Yet, a relentless shower of enchanted snowballs reveals its vulnerability, dismantling the icy facade and thawing the frigid menace.",
        attackMessages: [
            "The Frigid Fiend, Hailstorm Howler, lunges forward with bone-chilling swiftness!",
            "A deceptively normal wolf, Hailstorm Howler, reveals its arctic secret with a frigid assault!",
            "Feel the danger that lurks within the Hailstorm Howler as it disguises its frigid menace!",
            "Prepare for the icy guise of the Frigid Fiend, Hailstorm Howler, as it readies an arctic attack!",
            "Hailstorm Howler, the deceptively normal wolf, unveils its arctic secret with swift attacks!",
            "You face the bone-chilling howls of the Frigid Fiend, Hailstorm Howler, as it lunges forward!",
            "The arctic secret of Hailstorm Howler intensifies as it reveals its frigid menace!",
            "Swift attacks and bone-chilling howls define the Frigid Fiend, Hailstorm Howler, in this icy assault!",
            "Prepare to shatter the icy guise of Hailstorm Howler with a relentless storm of enchanted snowballs!",
            "Unleash enchanted snowballs to dismantle the icy facade of Hailstorm Howler, revealing its vulnerability!"
        ]
    },
    {
        id: 6,
        name: "Glacier Gazer, the Frozen Observer",
        shortName: "Glacier Gazer",
        xp: 1250,
        image: IMAGES.MONSTER_6,
        shortDescription: "Frozen Observer, Glacier Gazer, wields icy gazes. Shatter its gaze with a storm of enchanted snowballs!",
        description: "Encounter the Glacier Gazer, the Frozen Observer — a temple-like entity eternally encased in frost. " +
            "Its strength emanates from chilling gazes and ice-forming beams. " +
            "However, disrupt its frigid focus with a relentless volley of enchanted snowballs, revealing the icy behemoth's vulnerability.",
        attackMessages: [
            "Glacier Gazer, the Frozen Observer, fixes its icy gaze upon you!",
            "Eternally encased in frost, Glacier Gazer, readies its chilling gazes!",
            "Prepare to face the icy behemoth, Glacier Gazer, as it emanates chilling gazes!",
            "A temple-like entity, Glacier Gazer, focuses its icy power with penetrating gazes!",
            "Feel the frigid focus of Glacier Gazer's chilling gazes directed at you!",
            "You face the Frozen Observer, Glacier Gazer, as it readies its icy assault!",
            "Chilling gazes and ice-forming beams intensify as Glacier Gazer prepares its frigid focus!",
            "Glacier Gazer's icy behemoth strength manifests in chilling gazes directed at you!",
            "Prepare for the onslaught of the Frozen Observer, Glacier Gazer, and shatter its gaze with enchanted snowballs!",
            "Unleash a storm of enchanted snowballs to disrupt the frigid focus of Glacier Gazer, the Frozen Observer!"
        ]
    },
    {
        id: 7,
        name: "Sleet Shifter, the Frosty Phantom",
        xp: 1500,
        shortName: "Sleet Shifter",
        image: IMAGES.MONSTER_7,
        shortDescription: "Frosty Phantom, Sleet Shifter, twirls in frosty illusions. Unveil its spectral form with enchanted snowballs!",
        description: "Confront the Sleet Shifter, the Frosty Phantom — a once harmless fee now enchanted by Frostbite the Frozen. " +
            "Its strength lies in elusive movements and frosty illusions. " +
            "Yet, unleash a cascade of enchanted snowballs to pierce the icy enchantment, revealing the spectral fee's vulnerability.",
        attackMessages: [
            "Sleet Shifter, the Frosty Phantom, twirls in frosty illusions, preparing its spectral assault!",
            "A once harmless fee, now enchanted by Frostbite the Frozen, Sleet Shifter readies elusive movements!",
            "Feel the spectral presence of Sleet Shifter as it twirls in frosty illusions!",
            "Prepare for the icy enchantment of Sleet Shifter, the Frosty Phantom, as it readies its spectral assault!",
            "Sleet Shifter, once harmless, now enchanted, unleashes elusive movements and frosty illusions!",
            "You face the Frosty Phantom, Sleet Shifter, as it twirls in frosty illusions!",
            "Frostbite the Frozen's enchantment intensifies as Sleet Shifter prepares its spectral assault!",
            "Sleet Shifter's elusive movements and frosty illusions manifest, directed at you!",
            "Prepare for the onslaught of the Frosty Phantom, Sleet Shifter, and unveil its spectral form with enchanted snowballs!",
            "Unleash enchanted snowballs to pierce the icy enchantment of Sleet Shifter, revealing its vulnerable spectral form!"
        ],
    },
    {
        id: 8,
        name: "Polar Prowler, the Arctic Stalker",
        shortName: "Polar Prowler",
        xp: 1750,
        image: IMAGES.MONSTER_8,
        shortDescription: "Arctic Stalker, Polar Prowler, lurks in icy shadows. Expose its stealth with a storm of enchanted snowballs!",
        description: "Encounter the Polar Prowler, the Arctic Stalker—a stealthy leopard masterfully camouflaged in the snowy expanse. " +
            "Its strength thrives in sudden ambushes and razor-sharp claws. " +
            "Yet, disrupt its elusive approach with a storm of enchanted snowballs, exposing its vulnerability.",
        attackMessages: [
            "The Arctic Stalker, Polar Prowler, emerges from icy shadows to strike!",
            "Masterfully camouflaged in snow, Polar Prowler readies its sudden ambush!",
            "Prepare for the stealthy approach of Polar Prowler as it lurks in icy shadows!",
            "A leopard in the snowy expanse, Polar Prowler, thrives in sudden ambushes!",
            "Feel the elusive presence of Polar Prowler as it readies razor-sharp claws for an attack!",
            "You face the Arctic Stalker, Polar Prowler, as it emerges from icy shadows!",
            "Sudden ambushes and razor-sharp claws intensify as Polar Prowler prepares to strike!",
            "Polar Prowler's stealthy approach manifests in the snowy expanse, ready to strike!",
            "Prepare for the onslaught of the Arctic Stalker, Polar Prowler, and expose its stealth with enchanted snowballs!",
            "Unleash a storm of enchanted snowballs to disrupt the stealthy approach of Polar Prowler, the Arctic Stalker!"
        ],
    },
    {
        id: 9,
        name: "Chillwhisper, the Whispering Wraith",
        shortName: "Chillwhisper",
        xp: 2000,
        image: IMAGES.MONSTER_9,
        shortDescription: "Arctic Stalker, Polar Prowler, lurks in icy shadows. Expose its stealth with a storm of enchanted snowballs!",
        description: "Awaken Chillwhisper, the Whispering Wraith — a spectral entity emerging from the depths with electric snow attacks. " +
            "Strength lies in haunting whispers and icy shocks. " +
            "Yet, disrupt its ethereal form with an onslaught of enchanted snowballs, unraveling the wraith's vulnerability.",
        attackMessages: [
            "Chillwhisper, the Whispering Wraith, emerges from the depths with electric snow attacks!",
            "An ethereal entity, Chillwhisper, readies haunting whispers and icy shocks for an assault!",
            "Prepare to face the spectral might of Chillwhisper as it emerges with electric snow attacks!",
            "The depths awaken Chillwhisper, the Whispering Wraith, to unleash haunting whispers!",
            "Feel the ethereal presence of Chillwhisper as it readies electric snow attacks!",
            "You face the spectral entity, Chillwhisper, as it emerges with haunting whispers and icy shocks!",
            "Haunting whispers and icy shocks intensify as Chillwhisper prepares to attack!",
            "Chillwhisper's ethereal form manifests with electric snow attacks, ready to unleash its power!",
            "Prepare for the onslaught of Chillwhisper, the Whispering Wraith, and disrupt its ethereal form with a storm of enchanted snowballs!",
            "Unleash an onslaught of enchanted snowballs to unravel the vulnerability of Chillwhisper, the Whispering Wraith!"
        ],
    },
    {
        id: 10,
        name: "Frostfire Feline, the Icicle Panther",
        shortName: "Frostfire Feline",
        xp: 3000,
        image: IMAGES.MONSTER_10,
        shortDescription: "Icicle Panther, Frostfire Feline, leaps with fiery grace. Quench its flames with a storm of enchanted snowballs!",
        description: "Face the Frostfire Feline, the Icicle Panther — a majestic panther adorned in a shield of blue fire. " +
            "Its strength lies in swift icicle strikes and fiery leaps. " +
            "Yet, a relentless barrage of enchanted snowballs pierces the fiery defense, exposing the feline's vulnerability.",
        attackMessages: [
            "Frostfire Feline, the Icicle Panther, leaps with fiery grace towards you!",
            "A majestic panther adorned in blue fire, Frostfire Feline, readies swift icicle strikes!",
            "Prepare for the icy grace of Frostfire Feline as it leaps with fiery elegance!",
            "A shield of blue fire surrounds Frostfire Feline as it readies swift icicle strikes!",
            "Feel the majestic presence of Frostfire Feline, the Icicle Panther, as it leaps towards you!",
            "You face the fiery grace of Frostfire Feline as it readies swift icicle strikes!",
            "Fiery leaps and swift icicle strikes intensify as Frostfire Feline prepares to attack!",
            "Frostfire Feline's shield of blue fire manifests, ready to repel attacks with fiery grace!",
            "Prepare for the onslaught of Frostfire Feline, the Icicle Panther, and quench its flames with a storm of enchanted snowballs!",
            "Unleash a relentless barrage of enchanted snowballs to pierce the fiery defense of Frostfire Feline, exposing its vulnerability!"
        ],
    },
    {
        id: 11,
        name: "Blizzard Banshee, the Frozen Women",
        shortName: "Blizzard Banshee",
        xp: 3750,
        image: IMAGES.MONSTER_11,
        shortDescription: "Frozen Wraith, Blizzard Banshee, wails with icy gusts. Silence her cry with a storm of enchanted snowballs!",
        description: "Confront the Blizzard Banshee, the Frozen Wraith — a phantom with a visage frozen in spectral beauty. " +
            "Her strength lies in wailing gusts and ethereal enchantments. " +
            "Yet, unveil her vulnerability by bombarding with enchanted snowballs, disrupting the frigid illusions and silencing the banshee's humming.",
        attackMessages: [
            "Blizzard Banshee, the Frozen Wraith, unleashes wailing gusts of icy terror!",
            "A phantom with a frozen visage, Blizzard Banshee, readies ethereal enchantments!",
            "Prepare for the haunting cry of Blizzard Banshee as she wails with icy gusts!",
            "A visage frozen in spectral beauty, Blizzard Banshee, wails with frigid illusions!",
            "Feel the ethereal presence of Blizzard Banshee as she readies wailing gusts!",
            "You face the Frozen Wraith, Blizzard Banshee, as she unleashes haunting wails!",
            "Haunting wails and ethereal enchantments intensify as Blizzard Banshee prepares to attack!",
            "Blizzard Banshee's frigid illusions manifest, ready to unleash wailing gusts!",
            "Prepare for the onslaught of Blizzard Banshee, the Frozen Wraith, and silence her cry with a storm of enchanted snowballs!",
            "Unleash a storm of enchanted snowballs to disrupt the frigid illusions and silence the haunting cry of Blizzard Banshee!"
        ],
    },
    {
        id: 12,
        name: "Permafrost Prowler, the Icy Marauder",
        shortName: "Permafrost Prowler",
        xp: 6000,
        image: IMAGES.MONSTER_12,
        shortDescription: "Icy Marauder, Permafrost Prowler, wields ice might. Crush defenses with a storm of enchanted snowballs!",
        description: "Encounter the Permafrost Prowler, the Icy Marauder—a formidable foe clad in Glowfire armor, wielding an ice scepter. " +
            "Strength emanates from icy strikes and magical defenses. " +
            "Yet, shatter the frigid facade with a relentless volley of enchanted snowballs, uncovering the marauder's vulnerability.",
        attackMessages: [
            "Permafrost Prowler, the Icy Marauder, wields ice might, preparing to crush your defenses!",
            "A formidable foe in Glowfire armor, Permafrost Prowler, readies icy strikes!",
            "Prepare for the icy might of Permafrost Prowler as it wields an ice scepter!",
            "Glowfire armor adorns Permafrost Prowler, the Icy Marauder, readying for an assault!",
            "Feel the formidable presence of Permafrost Prowler as it readies icy strikes!",
            "You face the Icy Marauder, Permafrost Prowler, as it prepares to crush your defenses!",
            "Icy strikes and magical defenses intensify as Permafrost Prowler prepares to attack!",
            "Permafrost Prowler's frigid facade manifests, ready to unleash icy might!",
            "Prepare for the onslaught of Permafrost Prowler, the Icy Marauder, and crush its defenses with a storm of enchanted snowballs!",
            "Unleash a relentless volley of enchanted snowballs to shatter the frigid facade and uncover the vulnerability of Permafrost Prowler!"
        ],
    },
    {
        id: 13,
        name: "Snowsquall Seraph, the Frostwing Angel",
        shortName: "Snowsquall Seraph",
        xp: 6300,
        image: IMAGES.MONSTER_13,
        shortDescription: "Frostwing Angel, Snowsquall Seraph, conjures snowstorms. Disrupt her celestial grace with enchanted snowballs!",
        description: "Confront the Snowsquall Seraph, the Frostwing Angel—an ethereal being with crystalline wings casting enchanting snowstorms. " +
            "Strength lies in celestial fury and radiant gaze. " +
            "Yet, disrupt the ethereal visage with an unyielding barrage of enchanted snowballs, revealing the seraph's vulnerability.",
        attackMessages: [
            "Snowsquall Seraph, the Frostwing Angel, conjures snowstorms, preparing to disrupt your celestial grace!",
            "An ethereal being with crystalline wings, Snowsquall Seraph, readies celestial fury!",
            "Prepare for the celestial fury of Snowsquall Seraph as she conjures enchanting snowstorms!",
            "Crystalline wings adorn Snowsquall Seraph, the Frostwing Angel, readying for an ethereal assault!",
            "Feel the ethereal presence of Snowsquall Seraph as she readies celestial fury!",
            "You face the Frostwing Angel, Snowsquall Seraph, as she prepares to disrupt your celestial grace!",
            "Celestial fury and radiant gaze intensify as Snowsquall Seraph prepares to attack!",
            "Snowsquall Seraph's ethereal visage manifests, ready to conjure enchanting snowstorms!",
            "Prepare for the onslaught of Snowsquall Seraph, the Frostwing Angel, and disrupt her celestial grace with a storm of enchanted snowballs!",
            "Unleash an unyielding barrage of enchanted snowballs to reveal the vulnerability of Snowsquall Seraph!"
        ],
    },
    {
        id: 14,
        name: "Hypothermia Hydra, the Frostbite Fiend",
        shortName: "Hypothermia Hydra",
        xp: 6500,
        image: IMAGES.MONSTER_14,
        shortDescription: "Frostbite Fiend, Hypothermia Hydra, breathes freezing mist. Defeat with a relentless storm of enchanted snowballs!",
        description: "Face the Hypothermia Hydra, the Frostbite Fiend—a serpent morphing into multi-headed icy terror. " +
            "Each head breathes chilling mists and freezing snow. " +
            "Yet, unravel its formidable defense with a relentless onslaught of enchanted snowballs, exposing the hydra's vulnerability.",
        attackMessages: [
            "Hypothermia Hydra, the Frostbite Fiend, breathes freezing mist, preparing to engulf you in icy terror!",
            "A serpent morphing into multi-headed icy terror, Hypothermia Hydra, readies to unleash chilling mists!",
            "Prepare for the chilling mists of Hypothermia Hydra as each head breathes freezing snow!",
            "Multi-headed icy terror manifests in Hypothermia Hydra, the Frostbite Fiend, readying for an assault!",
            "Feel the formidable presence of Hypothermia Hydra as it readies to engulf you in chilling mists!",
            "You face the Frostbite Fiend, Hypothermia Hydra, as it prepares to unleash freezing snow!",
            "Chilling mists and freezing snow intensify as Hypothermia Hydra prepares to attack!",
            "Hypothermia Hydra's icy defense manifests, ready to engulf you in freezing mist!",
            "Prepare for the onslaught of Hypothermia Hydra, the Frostbite Fiend, and unravel its formidable defense with a storm of enchanted snowballs!",
            "Unleash a relentless onslaught of enchanted snowballs to expose the vulnerability of Hypothermia Hydra!"
        ],
    },
    {
        id: 15,
        name: "Frostblossom, the Frozen Florist",
        shortName: "Frostblossom",
        xp: 7200,
        image: IMAGES.MONSTER_15,
        shortDescription: "Frozen Florist, Frostblossom, commands hypnotic blooms. Shatter the enchantment with a storm of enchanted snowballs!",
        description: "Encounter Frostblossom, the Frozen Florist—an enigmatic figure adorned with frosty petals, commanding animated ice blooms. " +
            "Strength lies in hypnotic fragrances and mesmerizing blooms. " +
            "Yet, disrupt the enchanting aura with a relentless volley of enchanted snowballs, revealing the florist's vulnerability.",
        attackMessages: [
            "Frostblossom, the Frozen Florist, commands hypnotic blooms, preparing to shatter your enchantment!",
            "An enigmatic figure adorned with frosty petals, Frostblossom, readies mesmerizing blooms!",
            "Prepare for the hypnotic fragrances of Frostblossom as she commands animated ice blooms!",
            "Frosty petals adorn Frostblossom, the Frozen Florist, readying for an enchanting assault!",
            "Feel the enchanting aura of Frostblossom as she readies mesmerizing blooms!",
            "You face the Frozen Florist, Frostblossom, as she prepares to shatter your enchantment!",
            "Hypnotic fragrances and mesmerizing blooms intensify as Frostblossom prepares to attack!",
            "Frostblossom's enchanting aura manifests, ready to command animated ice blooms!",
            "Prepare for the onslaught of Frostblossom, the Frozen Florist, and shatter the enchantment with a storm of enchanted snowballs!",
            "Unleash a relentless volley of enchanted snowballs to reveal the vulnerability of Frostblossom!"
        ],
    },
    {
        id: 16,
        name: "Ice Symbiot Golem, the Frostforged Sentinel",
        shortName: "Ice Symbiot Golem",
        xp: 9000,
        image: IMAGES.MONSTER_16,
        shortDescription: "Frostforged Sentinel, Ice Symbiot Golem, wields icy might. Shatter defenses with a relentless storm of enchanted snowballs!",
        description: "Confront the Ice Symbiot Golem, the Frostforged Sentinel—a colossus of frost, wielding icy symbiotic power. " +
            "Its strength lies in frozen resilience and formidable strikes. " +
            "Yet, unravel its icy defenses with a relentless storm of enchanted snowballs, exposing the sentinel's vulnerability.",
        attackMessages: [
            "Ice Symbiot Golem, the Frostforged Sentinel, wields icy might, preparing to shatter your defenses!",
            "A colossus of frost, Ice Symbiot Golem, readies formidable strikes!",
            "Prepare for the icy might of Ice Symbiot Golem as it wields frostforged power!",
            "Frozen resilience adorns Ice Symbiot Golem, the Frostforged Sentinel, readying for a formidable assault!",
            "Feel the formidable presence of Ice Symbiot Golem as it readies icy strikes!",
            "You face the Frostforged Sentinel, Ice Symbiot Golem, as it prepares to shatter your defenses!",
            "Icy strikes and frozen resilience intensify as Ice Symbiot Golem prepares to attack!",
            "Ice Symbiot Golem's frostforged power manifests, ready to unleash icy might!",
            "Prepare for the onslaught of Ice Symbiot Golem, the Frostforged Sentinel, and unravel its icy defenses with a relentless storm of enchanted snowballs!",
            "Unleash a relentless storm of enchanted snowballs to expose the vulnerability of Ice Symbiot Golem!"
        ],
    },
    {
        id: 17,
        name: "Frostbite the Frozen, the Icy Wizard",
        shortName: "Frostbite the Frozen",
        xp: 10000,
        image: IMAGES.MONSTER_LEADER,
        shortDescription: "Icy Wizard, Frostbite the Frozen, once loyal, now bitter. Defeat him with enchanted snowballs and special tactics!",
        description: "Once a loyal elf, Frostbite the Frozen turned sorcerer, fueled by bitterness. " +
            "Betrayed by Santa's oversight, he drank a secret potion, gaining dark powers. " +
            "His strength lies in corrupted magic and twisted creations. " +
            "Exploit his bitterness with enchanted snowballs and special tactics, revealing the frozen wizard's vulnerability.",
        attackMessages: [
            "Feel the frigid aura as Frostbite the Frozen, the Icy Wizard, readies his corrupted magic for a devastating assault!",
            "Dark powers surge within Frostbite the Frozen as he channels his bitterness into twisted creations!",
            "Prepare for the malevolent magic of Frostbite the Frozen, once loyal but now a bitter sorcerer!",
            "The icy wizard, Frostbite the Frozen, unleashes corrupted magic, fueled by the bitterness of betrayal!",
            "Beware the dark powers that manifest within Frostbite the Frozen, the Icy Wizard, as he seeks vengeance!",
            "Frostbite the Frozen, once a loyal elf, now channels his bitterness into twisted and malevolent creations!",
            "Feel the cold embrace of Frostbite the Frozen's corrupted magic as he conjures a chilling storm of despair!",
            "The twisted creations of Frostbite the Frozen, the Icy Wizard, come to life, ready to wreak havoc!",
            "Prepare for the malevolent magic of Frostbite the Frozen, fueled by the bitterness of past betrayal!",
            "Bitterness fuels the icy wizard, Frostbite the Frozen, as he weaves corrupted magic in preparation for a devastating onslaught!",
            "Dark energies swirl around Frostbite the Frozen, the Icy Wizard, as he unleashes a malevolent storm of frozen fury!",
            "Beware the corrupted magic of Frostbite the Frozen, once loyal but now a harbinger of icy vengeance!",
            "Feel the chill in the air as Frostbite the Frozen, the Icy Wizard, channels his bitterness into a malevolent and twisted assault!",
            "The once loyal elf, now a sorcerer seeking revenge, Frostbite the Frozen, readies his corrupted magic for a chilling assault!",
            "Prepare for the twisted creations and malevolent magic of Frostbite the Frozen as he seeks to freeze the world in bitter despair!",
        ]
    }
];

const LOCATIONS = [
    { id: 0, day: 7, name: "Arctic", monsterId: 0, giftCount: 100 },
    { id: 1, day: 8, name: "Tundra", monsterId: 1, giftCount: 150 },
    { id: 2, day: 9, name: "Glade", monsterId: 2, giftCount: 180 },
    { id: 3, day: 10, name: "Frostvale", monsterId: 3, giftCount: 200 },
    { id: 4, day: 11, name: "Everfrost", monsterId: 4, giftCount: 220 },
    { id: 5, day: 12, name: "Snowpeak", monsterId: 5, giftCount: 375 },
    { id: 6, day: 13, name: "Glacier", monsterId: 6, giftCount: 420 },
    { id: 7, day: 14, name: "Icicle", monsterId: 7, giftCount: 445 },
    { id: 8, day: 15, name: "Polar", monsterId: 8, giftCount: 492 },
    { id: 9, day: 16, name: "Blizzard", monsterId: 9, giftCount: 515 },
    { id: 10, day: 17, name: "Crystal", monsterId: 10, giftCount: 545 },
    { id: 11, day: 18, name: "Winterfell", monsterId: 11, giftCount: 582 },
    { id: 12, day: 19, name: "Frostwood", monsterId: 12, giftCount: 614 },
    { id: 13, day: 20, name: "Frosthaven", monsterId: 13, giftCount: 646 },
    { id: 14, day: 21, name: "Frostshire", monsterId: 14, giftCount: 672 },
    { id: 15, day: 22, name: "Chillcroft", monsterId: 15, giftCount: 694 },
    { id: 16, day: 23, name: "Snowhaven", monsterId: 16, giftCount: 781 },
    { id: 17, day: 24, name: "SouthPole", monsterId: 17, giftCount: 1000 },
];

const DEFEAT_MESSAGES = [
    `Oh no! The fearsome {{monster}} has triumphed over Santa, the elves, and you at the magical {{location}}. We lost {{snowballs}} snowballs in the battle, and only {{gifts}} gifts remain.`,
    `Disaster struck at the enchanting {{location}} as the mighty {{monster}} overcame Santa, the elves, and you. We lost {{snowballs}} snowballs, and a mere {{gifts}} gifts survive.`,
    `The once-jubilant atmosphere at {{location}} now bears witness to the defeat of Santa, the elves, and you by the formidable {{monster}}. We suffered a loss of {{snowballs}} snowballs, leaving only {{gifts}} gifts.`,
    `Alas! The {{monster}} has bested us all at the festive {{location}}. Our snowballs, {{snowballs}} in total, were not enough to withstand the creature's might. Now, only {{gifts}} gifts are left.`,
    `In the snowy land of {{location}}, a chilling defeat unfolded as the menacing {{monster}} conquered Santa, the elves, and you. {{snowballs}} snowballs were lost, and only {{gifts}} gifts remain.`,
    `The joyful echoes at {{location}} have faded as the ominous {{monster}} emerged victorious, defeating Santa, the elves, and you. We mourn the loss of {{snowballs}} snowballs, with only {{gifts}} gifts left.`,
    `At the heart of {{location}}, the legendary battle unfolded, resulting in the defeat of Santa, the elves, and you by the relentless {{monster}}. {{snowballs}} snowballs were sacrificed, leaving just {{gifts}} gifts.`,
    `A gloom has befallen {{location}} as the ferocious {{monster}} prevailed over Santa, the elves, and you. We lost {{snowballs}} snowballs, and only {{gifts}} gifts remain.`,
    `The magical aura of {{location}} shattered as the relentless {{monster}} conquered Santa, the elves, and you. We lost {{snowballs}} snowballs, leaving a meager {{gifts}} gifts in its wake.`,
    `The festive joy at {{location}} turned to sorrow as the formidable {{monster}} emerged triumphant, defeating Santa, the elves, and you. {{snowballs}} snowballs were lost, leaving only {{gifts}} gifts.`,
    `The enchanting {{location}} witnessed the defeat of Santa, the elves, and you by the fearsome {{monster}}. {{snowballs}} snowballs were lost, and only {{gifts}} gifts remain.`,
    `The magical aura of {{location}} dimmed as the powerful {{monster}} overcame Santa, the elves, and you. {{snowballs}} snowballs were lost in the battle, with only {{gifts}} gifts left.`,
    `Oh, the holiday spirit is dimmed at {{location}} as the mighty {{monster}} emerged victorious, defeating Santa, the elves, and you. We lost {{snowballs}} snowballs, and only {{gifts}} gifts remain.`,
    `At the festive gathering at {{location}}, a shadow cast by the {{monster}} loomed large, defeating Santa, the elves, and you. {{snowballs}} snowballs were sacrificed, leaving only {{gifts}} gifts.`,
    `The joyous celebration at {{location}} took a dark turn as the {{monster}} proved invincible, conquering Santa, the elves, and you. We lost {{snowballs}} snowballs, and only {{gifts}} gifts stand.`,
    `In the wintry landscape of {{location}}, a tale of defeat unfolded as the relentless {{monster}} conquered Santa, the elves, and you. {{snowballs}} snowballs were lost, with only {{gifts}} gifts remaining.`,
    `Alas, the festive merriment at {{location}} was shattered by the victory of the {{monster}}, defeating Santa, the elves, and you. {{snowballs}} snowballs were lost, leaving only {{gifts}} gifts.`,
    `The magical enchantment at {{location}} was broken as the formidable {{monster}} emerged victorious, defeating Santa, the elves, and you. {{snowballs}} snowballs were lost, with only {{gifts}} gifts surviving the onslaught.`,
    `In the realm of {{location}}, the jubilant holiday spirit turned to despair as the {{monster}} defeated Santa, the elves, and you. {{snowballs}} snowballs were lost, and only {{gifts}} gifts remain.`,
];

const WIN_MESSAGES = [
    `Hooray! The heroic efforts against the mighty {{monster}} at the enchanting {{location}} have prevailed. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are safe.`,
    `In a stunning turn of events at the magical {{location}}, the {{monster}} was defeated, and Santa, the elves, and you emerged victorious. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts remain.`,
    `Cheers echo through the festive air at {{location}} as the {{monster}} succumbs to defeat. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are secure.`,
    `Victory is ours! The fearsome {{monster}} was vanquished at the heart of {{location}}. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are intact.`,
    `The holiday spirit triumphs! The {{monster}} was no match for the resilience of Santa, the elves, and you at the wintry {{location}}. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts remain.`,
    `At the snowy battlefield of {{location}}, the relentless {{monster}} was defeated, and joyous celebrations ensue. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are accounted for.`,
    `A wave of relief washes over {{location}} as the heroic team emerges victorious against the {{monster}}. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are safe.`,
    `In the jubilant aftermath at {{location}}, the {{monster}} bows to the triumphant team of Santa, the elves, and you. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts remain.`,
    `The magical aura of {{location}} resonates with triumph as the {{monster}} is defeated. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are secure.`,
    `Oh, what a glorious day at {{location}}! The mighty {{monster}} has been vanquished, and victory belongs to Santa, the elves, and you. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts remain.`,
    `At the heart of {{location}}, the {{monster}} met its match, and joyous celebrations ensue. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are intact.`,
    `Rejoice! The {{monster}} was no match for the bravery at the magical {{location}}. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts remain.`,
    `The holiday cheer prevails as the {{monster}} is defeated at the enchanting {{location}}. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are secure.`,
    `A collective sigh of relief echoes through {{location}} as the victorious team emerges from the battle against the {{monster}}. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts remain.`,
    `In the wintry landscape of {{location}}, the {{monster}} is vanquished, and the holiday spirit reigns. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are accounted for.`,
    `Cheers of triumph fill the air at {{location}} as the {{monster}} is defeated, and victory belongs to Santa, the elves, and you. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts remain.`,
    `At the festive gathering at {{location}}, the {{monster}} bows down to the triumphant team. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are safe.`,
    `The jubilant holiday spirit prevails as the {{monster}} is defeated at the snowy battlefield of {{location}}. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts remain.`,
    `A wave of joy sweeps through {{location}} as the victorious team emerges triumphant. Only {{snowballs}} snowballs were used, and all {{gifts}} gifts are secure.`,
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
            SNOWBALL,
        },
        ITEMS,
        ITEM_TYPES,
        FIND,
        SHOP,
        MONSTERS,
        LOCATIONS,
        DURATION: 30 * 1000, // 30
        DEFEAT_MESSAGES,
        WIN_MESSAGES
    }
};

export default CONSTANTS;