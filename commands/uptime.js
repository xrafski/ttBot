const config = require("../bot-settings.json");
// const { } = require("../ttBot");

module.exports.help = {
    name: "uptime",
    description: "Shows current uptime of the bot.",
    type: "public",
    usage: `**${config.BotPrefix}uptime**`
};

module.exports.run = async (bot, message) => {
    //////////////////////////////////////////////////////////////////////////////////////////////
    //                                          uptime                                          //
    //////////////////////////////////////////////////////////////////////////////////////////////

    return message.channel.send(`Current TT bot uptime: **${convertMiliseconds(bot.uptime)}**.`)
        .then(message => message.delete({ timeout: 5000 })).catch(() => { return });

    /////////////////////////////////////////////////////////////////////////////////////////

    function convertMiliseconds(miliseconds) {
        var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

        total_seconds = parseInt(Math.floor(miliseconds / 1000));
        total_minutes = parseInt(Math.floor(total_seconds / 60));
        total_hours = parseInt(Math.floor(total_minutes / 60));
        days = parseInt(Math.floor(total_hours / 24));

        seconds = parseInt(total_seconds % 60);
        minutes = parseInt(total_minutes % 60);
        hours = parseInt(total_hours % 24);


        if (days > 1) {
            if (hours > 1) {
                if (minutes === 1 && seconds === 1) return `${days} days ${hours} hours ${minutes} minute ${seconds} second`;
                if (minutes === 1) return `${days} days ${hours} hours ${minutes} minute ${seconds} seconds`;
                if (seconds === 1) return `${days} days ${hours} hours ${minutes} minutes ${seconds} second`;
                return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
            }

            if (hours === 1) {
                if (minutes === 1 && seconds === 1) return `${days} days ${hours} hour ${minutes} minute ${seconds} second`;
                if (minutes === 1) return `${days} days ${hours} hour ${minutes} minute ${seconds} seconds`;
                if (seconds === 1) return `${days} days ${hours} hour ${minutes} minutes ${seconds} second`;
                return `${days} days ${hours} hour ${minutes} minutes ${seconds} seconds`;
            }

            if (hours < 1) {
                if (minutes === 1 && seconds === 1) return `${days} days ${hours} hours ${minutes} minute ${seconds} second`;
                if (minutes === 1) return `${days} days ${hours} hours ${minutes} minute ${seconds} seconds`;
                if (seconds === 1) return `${days} days ${hours} hours ${minutes} minutes ${seconds} second`;
                return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
            }
        }

        if (days === 1) {
            if (hours > 1) {
                if (minutes === 1 && seconds === 1) return `${days} day ${hours} hours ${minutes} minute ${seconds} second`;
                if (minutes === 1) return `${days} day ${hours} hours ${minutes} minute ${seconds} seconds`;
                if (seconds === 1) return `${days} day ${hours} hours ${minutes} minutes ${seconds} second`;
                return `${days} day ${hours} hours ${minutes} minutes ${seconds} seconds`;
            }

            if (hours === 1) {
                if (minutes === 1 && seconds === 1) return `${days} day ${hours} hour ${minutes} minute ${seconds} second`;
                if (minutes === 1) return `${days} day ${hours} hour ${minutes} minute ${seconds} seconds`;
                if (seconds === 1) return `${days} day ${hours} hour ${minutes} minutes ${seconds} second`;
                return `${days} day ${hours} hour ${minutes} minutes ${seconds} seconds`;
            }

            if (hours < 1) {

                if (minutes === 1 && seconds === 1) return `${days} day ${hours} hours ${minutes} minute ${seconds} second`;
                if (minutes === 1) return `${days} day ${hours} hours ${minutes} minute ${seconds} seconds`;
                if (seconds === 1) return `${days} day ${hours} hours ${minutes} minutes ${seconds} second`;
                return `${days} day ${hours} hours ${minutes} minutes ${seconds} seconds`;
            }
        }

        if (days < 1) {
            if (hours > 1) {
                if (minutes === 1 && seconds === 1) return `${hours} hours ${minutes} minute ${seconds} second`;
                if (minutes === 1) return `${hours} hours ${minutes} minute ${seconds} seconds`;
                if (seconds === 1) return `${hours} hours ${minutes} minutes ${seconds} second`;
                return `${hours} hours ${minutes} minutes ${seconds} seconds`;
            }

            if (hours === 1) {
                if (minutes === 1 && seconds === 1) return `${hours} hour ${minutes} minute ${seconds} second`;
                if (minutes === 1) return `${hours} hour ${minutes} minute ${seconds} seconds`;
                if (seconds === 1) return `${hours} hour ${minutes} minutes ${seconds} second`;
                return `${hours} hour ${minutes} minutes ${seconds} seconds`;
            }

            if (hours < 1) {
                if (minutes < 1) {
                    if (seconds === 1) return `${seconds} second`;
                    if (seconds > 1) return `${seconds} seconds`;
                }

                if (minutes === 1 && seconds === 1) return `${minutes} minute ${seconds} second`;
                if (minutes === 1) return `${minutes} minute ${seconds} seconds`;
                if (seconds === 1) return `${minutes} minutes ${seconds} second`;
                return `${minutes} minutes ${seconds} seconds`;
            }
        }

    };
}