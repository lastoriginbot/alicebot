const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
const random = require('random')
var urlencode = require('urlencode');
const Canvas = require('canvas');
var name = require('../../library/name.js').name;
var fs = require('fs');


class RanRoll extends commando.Command {
    constructor(client) {
        super(client, {
            	name: 'quiz',
            	group: 'quiz',
            	memberName: 'quiz',
            	description: 'just quiz',
		examples: ['&quiz'],
        });
    }

    async run(message, input) {
	    if (0) {message.channel.send("In quiz channel only")}
	    else {
		    var link = "https://lastorigin.fandom.com/wiki/Unit_List"

			request(link, function(err, resp, html) {
				if (!err) {
					const $ = cheerio.load(html);
					var units = []
					$('.image.image-thumbnail.link-internal').each(function(i, elem) {
						units.push($(this).attr('title'))
					});
					for (var i = 0; i < units.length; i++) {
						var ind = random.int(0, units.length - 1)
						var temp = units[i]
						units[i] = units[ind]
						units[ind] = temp
					}
					var score = {}
					sendembed(units, message, score)
				}
			})
	    }
	}
}
function nameChange(unit) {
	if (name[unit]) {unit = name[unit];}
	unit = unit.toTitleCase()
	return unit
}
function sendembed(units, message, score) {
	if (units.length > 0) {
		var unit = units.pop()
		var link = "https://lastorigin.fandom.com/wiki/" + urlencode(unit);
		request(link, function(err, resp, html) {
			if (!err) {
				const $ = cheerio.load(html);
				var img
				var links = []
				console.log(link)
				for (var i = 1; i<10; i++){
					let img2 = $("#gallery-0 div:nth-child(" + i +") div div a img")..attr("data-src");
            				if (img2) {
						links.push(img2)
						console.log(img2)
					}
				}
				var ind = random.int(0, links.length - 1)
				img = links[ind]
				img = img.split("latest")[0] + "latest/scale-to-height-down/500"
				console.log(img)
				const filter = response => {
					let nam = nameChange(response.content.toLowerCase())
					return unit == nam
				};
				var options = {
					url: img,
					method: "get",
					encoding: null
				};
				request(options, function (error, response, body) {

					if (error) {
					console.error('error:', error);
					} else {
					fs.writeFileSync('test.jpg', body);
					var attachment = new Discord.Attachment('test.jpg', 'image.jpg');
						const exampleEmbed = new Discord.RichEmbed()
					.attachFile(attachment)
					.setImage('attachment://image.jpg');
					message.channel.send(exampleEmbed).then(mes => {
					message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
						.then(collected => {
							mes.delete()
							if (score[collected.first().author.id]) {score[collected.first().author.id] =score[collected.first().author.id] + 1}
							else {score[collected.first().author.id] = 1}
							message.channel.send(collected.first().author.username + ' got the correct answer!\nCorrect answer: ' + unit + '\nTry again?').then(msg => {
								msg.react('🇾')
								const backwardsFilter = (reaction, user) => (reaction.emoji.name === '🇾' && !user.bot);
								const backwards = msg.createReactionCollector(backwardsFilter, {timer: 6000 , max: 1});
								msg.awaitReactions(backwardsFilter, { max: 1, time: 12000, errors: ['time'] })
								.then(collected => {
									sendembed(units, message, score) 
									msg.delete()
								})
								.catch(collected => {
									msg.delete()
									leader(message, score)
								})
							})
						})
						.catch(collected => {
							mes.delete()
							message.channel.send('Looks like nobody got the answer this time.\nCorrect answer: ' + unit +'\nTry again?').then(msg => {
								msg.react('🇾')
								const backwardsFilter = (reaction, user) => (reaction.emoji.name === '🇾' && !user.bot);
								const backwards = msg.createReactionCollector(backwardsFilter, {timer: 6000 , max: 1});
								msg.awaitReactions(backwardsFilter, { max: 1, time: 12000, errors: ['time'] })
								.then(collected => {
									sendembed(units, message, score) 
									msg.delete()
								})
								.catch(collected => {
									msg.delete()
									leader(message, score)
								})
							})
						})
					});
					}
				})
			}
		})
	}
	else {
		message.channel.send("Out of unit")
		leader(message, score)
	}
}
function leader(message, score) {
		var items = Object.keys(score).map(function(key) {
			return [key, score[key]];
		});
		items.sort(function(first, second) {
			return second[1] - first[1];
		});
		var mes = "Ranking:"
		for (var i = 0; i < items.length; i ++) {
			let user = message.client.users.get(items[i][0]);
			let un = user.username
			let rank = i + 1
			mes = mes + "\n" + rank + "/ " + un + " : " + items[i][1]
		}
		if (items.length > 0) {message.channel.send(mes)}
}
module.exports = RanRoll;
