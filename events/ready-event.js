const { bot, BotVersion, errorLog } = require('../ttBot');
const config = require("../bot-settings.json");
bot.login(config.BotToken);

//////////////////////////////////////////////////////////////////////////////////////////////
//                                    READY EVENT HANDLER                                   //
//////////////////////////////////////////////////////////////////////////////////////////////

bot.on('ready', () => {
    console.info(`\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nTT Bot (${bot.user.tag}) has logged in!\nVersion: ${BotVersion}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);

    // bot.guilds.cache.forEach(guild => { // Fetch members when bot boot up.
    //     guild.members.fetch().catch(error => { errorLog(`ready-event.js:1 ready Event() Error to cache members of '${guild.name}'.`, error) })
    // });

    const guildObject = bot.guilds.cache.get(config.TTserverID);
    if (guildObject) {
        guildObject.members.fetch().catch(error => errorLog(`ready-event.js:1 ready Event()\nError to fetch guld members.`, error)) // Fetches member from Discord, even if they're offline.
            // .then(() => { // Update bot status every hour
            //     bot.user.setPresence({ activity: { name: ' ', type: 'WATCHING' }, status: 'idle' }).catch(error => errorLog(`ready-event.js:1 ready Event()\nError to set the bot activity.`, error))
            //         .then(() => {
            //             setInterval(() => { // update status every hour
            //                 bot.user.setPresence({ activity: { name: `${guildObject.memberCount} members 🍀`, type: 'WATCHING' }, status: 'online' }).catch(error => errorLog(`ready-event.js:2 ready Event()\nError to set the bot activity.`, error));
            //             }, 3600000);
            //         })
            // });
    } else {
        // Set the bot user's presence 
        bot.user.setPresence({ activity: { name: 'error to load guild', type: 'WATCHING' }, status: 'idle' })
            .catch(error => errorLog(`ready-event.js:2 ready Event()\nError to set the bot activity.`, error));
    }
});