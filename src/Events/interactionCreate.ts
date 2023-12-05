import { ChatInputCommandInteraction, Interaction } from "discord.js";
import { AdvancedClient } from "../shared";
import Shop from "../Modules/Economy/Shop";
import Prepare from "../Modules/Economy/Prepare";

const interactionCreate = async (client: AdvancedClient, interaction: Interaction) => {
    //console.log(`[Interaction] ${interaction.user.tag} triggered an interaction.`);
    if (interaction.isCommand()) { 
        client.commands.onInteraction(interaction as ChatInputCommandInteraction);
    } else if(interaction.isStringSelectMenu()) {
        if(interaction.customId.includes("shop|")) {
            Shop.execute(client, interaction);
        } else if(interaction.customId.includes("shopitem|")) {
            Shop.viewItem(client, interaction);
        } else if(interaction.customId.includes("shopstorage|")) {
            Shop.upgradeStorage(client, interaction);
        } else if(interaction.customId.includes("prepareinfo|")) {
            Prepare.executeUpdate(client, interaction);
        }
    } else if(interaction.isButton()) {
        if(interaction.customId.includes("shopelv|")) {
            Shop.purchaseElv(client, interaction);
        } else if(interaction.customId.includes("shopbuy|")) {
            Shop.purchaseItem(client, interaction);
        } else if(interaction.customId.includes("shopuse|")) {
            Shop.useItem(client, interaction);
        } else if(interaction.customId.includes("prepare|")) {
            Prepare.executePrepare(client, interaction);
        }
    } else if(interaction.isModalSubmit()) {
        if(interaction.customId.includes("preparemodal|")) {
            Prepare.executePrepareModal(client, interaction);
        }
    }
}
export default interactionCreate;