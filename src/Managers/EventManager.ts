import fs from "fs";
import path from "path";
import EventEmitter from "events";
import { Client } from "discord.js";

const resolveFolder = (folderName: string) => path.resolve(__dirname, ".", folderName);

export class EventManager extends EventEmitter {
    client: Client<boolean>;
    allEvents: Record<string, Function>;
    constructor(client: Client) {
        super();
        this.client = client;       
        this.allEvents = {};
    } 
    load() {
        const eventsFolder = resolveFolder("../Events");
        let i = 0;
        fs.readdirSync(eventsFolder).map(async (file) => {
            if (!file.endsWith(".js")) return;
            i++
            const fileName = path.join(eventsFolder, file);
            const event = require(fileName);
            const eventName = file.split(".")[0];
            
            this.client.on(eventName, event.default.bind(null, this.client));
        });
        console.log(`[Loaded Events] ${i}`);
        return this.allEvents;
    }
}