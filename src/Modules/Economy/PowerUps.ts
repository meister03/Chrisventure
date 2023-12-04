import CONSTANTS from "../../Constants/Constants";
import { UserDocument } from "../Database/userSchema";

export class PowerUps {
    static calculateSnowBallAmount(user: UserDocument) {
        const powerUpItems = user.powerUps.filter((power) => power.until > new Date()).map((power) => {
            const powerUp = CONSTANTS.GAME.ITEMS.find((item) => item.id === power.id);
            return {
                name: powerUp?.name,
                increase: powerUp?.increase,
                target: powerUp?.target,
                type: powerUp?.type,
                until: power.until,
            }
        }).filter((power) => power.type === 'collect' && power.target === 'elf');

        const powerUpPercentage = powerUpItems.reduce((acc, curr) => acc + curr.increase!, 0);
        return Math.ceil(user.elvesCount * 10 * (1 + powerUpPercentage));
    }

    static findSnowBallAmount(user: UserDocument) {
        const powerUpItems = user.powerUps.filter((power) => power.until > new Date()).map((power) => {
            const powerUp = CONSTANTS.GAME.ITEMS.find((item) => item.id === power.id);
            return {
                name: powerUp?.name,
                increase: powerUp?.increase,
                target: powerUp?.target,
                type: powerUp?.type,
                until: power.until,
            }
        }).filter((power) => power.type === 'collect' && power.target === 'player');

        const powerUpPercentage = powerUpItems.reduce((acc, curr) => acc + curr.increase!, 0);
        console.log(powerUpPercentage);

        // Random number between 10-20
        const random = Math.floor(Math.random() * (20 - 10 + 1) + 10);
        return Math.ceil(random * (1 + powerUpPercentage));
    }

    static viewPowerUps(powerUps: UserDocument['powerUps']) {
        const powerUpItems = powerUps.filter((power) => power.until > new Date()).map((power) => {
            const powerUp = CONSTANTS.GAME.ITEMS.find((item) => item.id === power.id);
            return {
                name: powerUp?.name,
                increase: powerUp?.increase,
                target: powerUp?.target,
                type: powerUp?.type,
                until: power.until,
            }
        }).filter((power) => power.type === 'collect');

        return powerUpItems.map((power) => {
            return `**${power.name}** - ${"`" + power.increase! * 100 + "%`"} increase for ${power.target} until <t:${((power.until.getTime())/1000).toFixed(0)}:R>`;
        }).join('\n');
    }

    static viewItems(items: UserDocument['items']) {
        const itemItems = items.map((item) => {
            const powerUp = CONSTANTS.GAME.ITEMS.find((i) => i.id === item.id);
            return {
                name: powerUp?.name,
                increase: powerUp?.increase,
                target: powerUp?.target,
                type: powerUp?.type,
                until: powerUp?.until,
                count: item.count,
            }
        }).filter((item) => item.type === 'collect');

        return itemItems.map((item) => {
            return `**${item.name}** - ${item.type} - ${"`" + item.count + "`"}`;
        }).join('\n');
    }
}