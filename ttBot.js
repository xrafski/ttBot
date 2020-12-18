const Discord = require('discord.js');
const config = require("./bot-settings.json");
const fs = require('fs');
require('console-stamp')(console, 'dd/mm/yyyy - HH:MM:ss');

const bot = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

// define current bot version
const BotVersion = '1.0a';

// define global embed color
const embedColors = {
	'sayMessage': '#c4b9b9',				//	say.js
	'pollMessage': "#c4b9b9",				// poll.js
}

const emojiCharacters = {
	a: '🇦', b: '🇧', c: '🇨', d: '🇩',
	e: '🇪', f: '🇫', g: '🇬', h: '🇭',
	i: '🇮', j: '🇯', k: '🇰', l: '🇱',
	m: '🇲', n: '🇳', o: '🇴', p: '🇵',
	q: '🇶', r: '🇷', s: '🇸', t: '🇹',
	u: '🇺', v: '🇻', w: '🇼', x: '🇽',
	y: '🇾', z: '🇿', 0: '0⃣', 1: '1⃣',
	2: '2⃣', 3: '3⃣', 4: '4⃣', 5: '5⃣',
	6: '6⃣', 7: '7⃣', 8: '8⃣', 9: '9⃣',
	10: '🔟', '#': '#⃣', '*': '*⃣',
	'!': '❗', '?': '❓', 'i': 'ℹ️',
};

// define icon image url for embeds
// const TEAlogo = 'https://skillez.eu/images/discord/teabanner.png'
const TEAlogo = 'https://i.imgur.com/erwViqL.png';

// Load commands and events
bot.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
	if (err) console.error(err);

	let jsfiles = files.filter(f => f.split('.').pop() === 'js');
	if (jsfiles.length <= 0) return console.log('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nThere are no commands to load...\n\n');

	console.log(`▬▬▬▬▬▬▬▬ LOADED COMMANDS (${jsfiles.length}) ▬▬▬▬▬▬▬▬`);
	jsfiles.forEach((f, i) => {

		let props = require(`./commands/${f}`);
		console.log(`${i + 1}: ${props.help.type} - ${f}`);
		bot.commands.set(props.help.name, props);
	});
});

fs.readdir('./events/', (err, files) => {
	if (err) console.error(err);

	let jsfiles = files.filter(f => f.split('.').pop() === 'js');
	if (jsfiles.length <= 0) return console.log('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nThere are no events to load...\n\n');

	console.log(`\n▬▬▬▬▬▬▬▬ LOADED EVENTS (${jsfiles.length}) ▬▬▬▬▬▬▬▬`);
	jsfiles.forEach((f, i) => {
		require(`./events/${f}`);
		console.log(`${i + 1}: ${f}`);
	});
});

module.exports = {
	bot: bot, // bot client
	Discord: Discord, // discord module
	TEAlogo: TEAlogo, // defines icon image url for embeds
	embedColors: embedColors, // defines array of defined colors
	BotVersion: BotVersion, // defines current bot version
	emojiCharacters: emojiCharacters, // defines some discord emojis

	ownerDM: function (message) {
		let Owner = bot.users.cache.get(config.BotOwnerID);
		Owner.send(message).catch(() => { return; });
	},

	errorLog: function (text, error) {
		if (!error) error = '';
		if (!text) text = 'Text is not provided';

		if (!bot.users.cache.get(config.BotOwnerID)) return console.warn(`ttBot.js:1 errorLog() ❌ The bot Owner is UNDEFINED (probably wrong userID in: config.BotOwnerID)`);
		bot.users.cache.get(config.BotOwnerID).send(`❌ an issue occurred with the **${bot.user.username}** application!` + "```" + text + "```" + error)
			.then(() => console.error(`${text}`, error))
			.catch((error) => { console.warn(`ttBot.js:2 errorLog() ❌ Owner has DMs disabled.`, error) });
	},

	getCommand: function (commandName) {
		return bot.commands.get(commandName);
	},

	getCommands: function () {
		return bot.commands;
	},

	messageRemoverWithReact: async function (message, author) {
		await message.react('❌').catch(() => { return });

		const emojiFilter = (reaction, user) => {
			return ['❌'].includes(reaction.emoji.name) && !user.bot && author === user;
		}

		message.awaitReactions(emojiFilter, { max: 1, time: 60000 })
			.then(collected => {
				const reaction = collected.first();
				if (reaction.emoji.name === '❌') return message.delete().catch(() => { return });
			})
			.catch(error => {
				if (error.message === "Cannot read property 'emoji' of undefined") return message.delete().catch(() => { return });

				if (!bot.users.cache.get(config.BotOwnerID)) return console.warn(`ttBot.js:4 messageRemoverWithReact() ❌ The bot Owner is UNDEFINED (probably wrong userID in: config.BotOwnerID)`);
				bot.users.cache.get(config.BotOwnerID).send(`❌ an issue occurred with the **${bot.user.username}** application!` + "```" + `ttBot.js:5 messageRemoverWithReact()` + "```" + error)
					.then(() => console.error(`ttBot.js:5 messageRemoverWithReact().`, error))
					.catch((error) => { console.warn(`ttBot.js:6 messageRemoverWithReact() ❌ Owner has DMs disabled.`, error) });
			});
	},

	sendEmbedLog: async function (embedMessage, channelID, webHookName) {
		// Send a webhook message and create one if missing (no need to provide webhookID in the config file)
		try {
			var logChannel = bot.channels.cache.get(channelID);
			const webhooks = await logChannel.fetchWebhooks();
			const botwebhook = await webhooks.find(webhook => webhook.owner === bot.user && webhook.name === webHookName);

			await botwebhook.send(embedMessage);

			// await botwebhook.send('Webhook test', {
			//     username: 'username',
			//     avatarURL: 'https://skillez.eu',
			//     embeds: [embedMessage],
			// });

		} catch (error) {

			switch (error.message) {
				case "Cannot read property 'send' of undefined": {
					return logChannel.createWebhook(webHookName, {
						avatar: 'https://skillez.eu/images/discord/teaicon.png',
					})
						.then(webhook => {
							webhook.send(embedMessage);
							return console.info(`ttBot.js:1 sendEmbedLog() Created webhook: '${webhook.name}' for the #${logChannel.name} channel.`);
						});
				}
				case "Cannot read property 'fetchWebhooks' of undefined": {
					if (!bot.users.cache.get(config.BotOwnerID)) return console.warn(`ttBot.js:2 sendEmbedLog() ❌ The bot Owner is UNDEFINED (probably wrong userID in: config.BotOwnerID)`);
					bot.users.cache.get(config.BotOwnerID).send(`❌ an issue occurred with the **${bot.user.username}** application!` + "```" + `ttBot.js:3 sendEmbedLog()\nChannel 'logChannel' not found.` + "```" + error)
						.then(() => console.error(`ttBot.js:3 sendEmbedLog()\nChannel 'logChannel' not found.`, error))
						.catch((error) => { console.warn(`ttBot.js:4 sendEmbedLog() ❌ Owner has DMs disabled.`, error) });
					return;
				}
				case "Missing Permissions": {
					if (!bot.users.cache.get(config.BotOwnerID)) return console.warn(`ttBot.js:5 sendEmbedLog() ❌ The bot Owner is UNDEFINED (probably wrong userID in: config.BotOwnerID)`);
					bot.users.cache.get(config.BotOwnerID).send(`❌ an issue occurred with the **${bot.user.username}** application!` + "```" + `ttBot.js:6 sendEmbedLog()\nProbably: MANAGE_WEBHOOKS.` + "```" + error)
						.then(() => console.error(`ttBot.js:6 sendEmbedLog()\nProbably: MANAGE_WEBHOOKS.`, error))
						.catch((error) => { console.warn(`ttBot.js:7 sendEmbedLog() ❌ Owner has DMs disabled.`, error) });
					return;
				}
				default: {
					if (!bot.users.cache.get(config.BotOwnerID)) return console.warn(`ttBot.js:8 sendEmbedLog() ❌ The bot Owner is UNDEFINED (probably wrong userID in: config.BotOwnerID)`);
					bot.users.cache.get(config.BotOwnerID).send(`❌ an issue occurred with the **${bot.user.username}** application!` + "```" + `ttBot.js:9 sendEmbedLog()\nError trying to send a webhook.` + "```" + error)
						.then(() => console.error(`ttBot.js:9 sendEmbedLog()\nError trying to send a webhook.`, error))
						.catch((error) => { console.warn(`ttBot.js:10 sendEmbedLog() ❌ Owner has DMs disabled.`, error) });
					return;
				}
			}
		}
	},

	removeUserLastMessage: function (Member) {
		if (Member.lastMessage === null) return;
		Member.lastMessage.channel.messages.fetch(Member.lastMessage.id)
			.then(MemberLastMessage => {
				if (MemberLastMessage.deletable) MemberLastMessage.delete({ timeout: 750 }).catch(() => { return; });
			}).catch((error) => {
				console.error(`ttBot.js:1 ❌ removeUserLastMessage() issue occurred`, error);
				if (!bot.users.cache.get(config.BotOwnerID)) return console.warn(`ttBot.js:2 removeUserLastMessage() ❌ The bot Owner is UNDEFINED (probably wrong userID in: config.BotOwnerID)`);
				bot.users.cache.get(config.BotOwnerID).send(`❌ an issue occurred with the **${bot.user.username}** application!` + "```ttBot.js:1 ❌ removeUserLastMessage() issue occurred```" + error)
					.catch((error) => { console.warn(`ttBot.js:3 removeUserLastMessage() ❌ Owner has DMs disabled.`, error) });
			});
	}
}