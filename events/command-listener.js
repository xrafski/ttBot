const { bot, removeUserLastMessage, errorLog } = require('../ttBot');
const config = require("../bot-settings.json");

//////////////////////////////////////////////////////////////////////////////////////////////
//                                     COMMANDS HANDLER                                     //
//////////////////////////////////////////////////////////////////////////////////////////////

bot.on("message", async message => {
    if (message.author.bot) return;
    // if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.BotPrefix)) return;

    const args = message.content.slice(config.BotPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let cmdFile = bot.commands.get(command);
    if (cmdFile) {
        removeUserLastMessage(message.author);

        switch (cmdFile.help.type) {
            case "KICK_MEMBERS": {
                if (message.channel.type != "dm") {
                    if (message.guild.id === config.TTserverID && message.member.hasPermission("KICK_MEMBERS")) return cmdFile.run(bot, message, args);
                    else return message.reply(`You don't have access to run **${config.BotPrefix}${cmdFile.help.name}**!`)
                        .then(message => { message.delete({ timeout: 10000 }).catch(() => { return; }) });
                } else return message.channel.send(`**${config.BotPrefix}${cmdFile.help.name}** is not available on DM!`);
            }
            case "dm": if (message.channel.type === "dm") return cmdFile.run(bot, message, args);
            else return message.channel.send(`**${config.BotPrefix}${cmdFile.help.name}** is only available via direct message.`)
                .then(message => { message.delete({ timeout: 10000 }).catch(() => { return; }) });

            case "public": if (message.channel.type != "dm") return cmdFile.run(bot, message, args)
            else return message.channel.send(`**${config.BotPrefix}${cmdFile.help.name}** is not available on DM!`)
                .then(message => { message.delete({ timeout: 10000 }).catch(() => { return; }) });

            case "disabled": if (message.channel.type != "dm") return message.reply(`**${config.BotPrefix}${cmdFile.help.name}** is currently **disabled**!`)
                .then(message => { message.delete({ timeout: 10000 }).catch(() => { return; }) });

            default: return errorLog(`command-listener.js:1 command switch() default - no type was found for the ${cmdFile.help.name} command.`);
        }
    }
});