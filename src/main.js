import config from 'config'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { ogg } from './ogg.js'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))//Токен который мы получаем от самого тг

bot.on(message('voice'), async (ctx) => { //Обработчик любого Голосового сообщения
	try {
		const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
		const userId = String(ctx.message.from.id)
		console.log(link.href)
		const oggPath = await ogg.create(link.href, userId)//сохранение в папке voice ogg голосовое
		const mp3Path = await ogg.toMp3(oggPath, userId)//перевод ogg to mp3 под id пользователя
		await ctx.reply(mp3Path)  
	} catch(e) {
		console.log('Ошибка: Голос не распознать', e.message);
	}
})

bot.command('start', async(ctx) => { //Обратный ответ на сообщение /start(обработка команды)
	await ctx.reply(JSON.stringify(ctx.message, null, 2)) 
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

