const { Discord, getCommands, getCommand, TEAlogo, messageRemoverWithReact } = require('../ttBot');
const config = require("../bot-settings.json");

module.exports.help = {
    name: "help",
    description: "List all of commands.",
    type: "public",
    usage: `**${config.BotPrefix}help**\n${config.BotPrefix}help commandName`
};

module.exports.run = async (bot, message, args) => {
    //////////////////////////////////////////////////////////////////////////////////////////////
    //                                     help commandName                                     //
    //////////////////////////////////////////////////////////////////////////////////////////////

    if (args[0]) {
        if (getCommand(args[0])) {
            return message.channel.send(`Help for the **${config.BotPrefix}${args[0]}** command:\nAccess Level: __${getCommand(args[0]).help.type}__\nDescription: ${getCommand(args[0]).help.description}\n\nUsage: ${getCommand(args[0]).help.usage}`)
                .then(helpMessage => messageRemoverWithReact(helpMessage, message.author));
        }
    }

    let kickCommands = await getCommands().filter(command => command.help.type.includes('KICK_MEMBERS')).map(command => `**${command.help.name}** • ${command.help.description}`).join('\n');
    let publicCommands = await getCommands().filter(command => command.help.type.includes('public')).map(command => `**${command.help.name}** • ${command.help.description}`).join('\n');
    let disabledCommands = await getCommands().filter(command => command.help.type.includes('disabled')).map(command => `**${command.help.name}** • ${command.help.description}`).join('\n');

    if (!kickCommands) kickCommands = 'There is no KICK_MEMBERS commands.';
    if (!publicCommands) publicCommands = 'There is no public commands.';

    if (!disabledCommands) {
        return message.channel.send(`List of all commands! (prefix: **${config.BotPrefix}**)\nType **${config.BotPrefix}help commandName** for more details.\n\n👮‍♂️ KICK_MEMBERS Commands:\n${kickCommands}\n\n📢 Public Commands:\n${publicCommands}`)
            .then(helpMessage => messageRemoverWithReact(helpMessage, message.author));
    }

    return message.channel.send(`List of all commands! (prefix: **${config.BotPrefix}**)\nType **${config.BotPrefix}help commandName** for more details.\n\n👮‍♂️ KICK_MEMBERS Commands:\n${kickCommands}\n\n📢 Public Commands:\n${publicCommands}\n\n❌ Disabled Commands:\n${disabledCommands}`)
        .then(helpMessage => messageRemoverWithReact(helpMessage, message.author));
}