let DBClass = require('./lib/db')
const db = new DBClass('./store.json')
DBClass = null

require('dotenv').config()
const Discord = require('discord.js')

const bot = new Discord.Client()

bot.on('ready', () => {
	console.log('Login')

	bot.user.setStatus(db.getActive() ? 'online' : 'idle')
	bot.user.setActivity(
		`around,  annoyed ${db.getCount()} people. Type ok!info for info`,
		{ type: 'PLAYING' }
	)
})

bot.on('message', (message) => {
	if (message.content.toLowerCase() == 'ok!toggle') {
		db.toggleActive()
		message.channel.send(`Toggled state to ${db.getCount() ? 'on' : 'off'}`)
		return
	}

	if (db.getActive()) {
		if (message.content.toLowerCase() == 'ok!info') {
			const info = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle('OK bot')
				.setDescription('An bot to say ok to anything that is posted.')
				.addField(
					'People annoyed',
					`I have annoyed a total of ${db.getCount()} people`,
					true
				)
				.addField(
					'Global toggle',
					'You can toggle this bot on / off for everyone with ok!toggle. Remember, this applies to EVERYONE',
					true
				)
				.setTimestamp()

			message.channel.send(info)
		} else if (message.content.toLowerCase() != 'ok') {
			message.channel.send('ok')

			db.incrementCount()

			if (db.getCount() % 50 == 0)
				message.channel.send(`You were the ${db.getCount()}th person annoyed!`)
		
		} else if (message.author.username != bot.user.username) {
			message.react('😁')
			message.react('❤️')
		}
	}
})

bot.login(process.env.TOKEN)
