const { bot, BotVersion, errorLog } = require('../ttBot');
const config = require("../bot-settings.json");
bot.login(config.botToken);

//////////////////////////////////////////////////////////////////////////////////////////////
//                                    READY EVENT HANDLER                                   //
//////////////////////////////////////////////////////////////////////////////////////////////

bot.on('ready', () => {
    console.info(`\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nTwisted Tranquility Bot (${bot.user.tag}) has logged in!\nVersion: ${BotVersion}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);
});