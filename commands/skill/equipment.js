const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
require('@gouch/to-title-case')
var urlencode = require('urlencode');
var name3 = require('../../library/name.js').name;
var name2 = require('../../library/equip.js').name;
class Equip extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'equipment',
			group: 'find',
			aliases: ['equip', 'e'],
			memberName: 'equipment',
			description: 'list data of an equipment',
			args: [{
				key: 'text',
				prompt: 'What unit do you want to know about?',
				type: 'string'
			}]
		});
	}
	async run(message, { text }) {
		var gear = text.toLowerCase()
		gear = nameChange(gear)
		gear = gear.toLowerCase()
		var li = gear.split(" ")
		var li2 = li[li.length - 1]
		var li3 = li[0]
		var link
		if (li2 == "chip") {
			link = "https://lastorigin.fandom.com/wiki/Sub:Equipment/Chips"
		}
		else if (li2 == "beta") {
			if (li[li.length - 2] == "chip") {
				gear = nameChange(li.slice(0, li.length - 1).join(" ")) + " beta"
				gear = gear.toLowerCase()
				console.log(gear)
				link = "https://lastorigin.fandom.com/wiki/Sub:Equipment/Chips"
			}
		}
		else if (li2 == "os") {
			link = "https://lastorigin.fandom.com/wiki/Sub:Equipment/OS"
		}
		else if (li3 == "rogue") {
			link = "https://lastorigin.fandom.com/wiki/Sub:Equipment/OS"
		}
		else { link = "https://lastorigin.fandom.com/wiki/Sub:Equipment/Gears" }

		request(link, function (err, resp, html) {
			if (!err) {
				var check = false
				const $ = cheerio.load(html);
				var pages = []
				$('.wikitable tbody tr').each(function (i, elem) {
					let tags = $(this).children().eq(1).find('a')
					if (tags.length > 0) {
						let name = tags.eq(0).html()
						name = te(name)
						if (name) {
							if (rankRemove(name.toLowerCase()) == gear) {
								check = true
								let img = $(this).children().eq(0).find('a').find('img').eq(0).attr('data-src')
								if (!img) { img = $(this).children().eq(0).find('a').find('img').eq(0).attr('src') }
								let eff = $(this).children().eq(2).html()
								eff = te(eff)
								let note = $(this).children().eq(3).text()
								note = te(note)
								let exp = $(this).children().eq(4).text()
								exp = te(exp)
								let embed = new Discord.RichEmbed()
								img = img.split("/scale-to-width-down/")[0]
								console.log(img)
								embed.setTitle(name)
								embed.setThumbnail(img)
								let link2 = "https://lastorigin.fandom.com/wiki/" + urlencode(name);
								console.log(link2)
								embed.setURL(link2)
								embed.addField("Effect", eff)
								if (note) { embed.addField("Note", note) }
								if (exp) { embed.addField("EXP to Max", exp) }
								embed.setFooter("Effects within square brackets are applied as combat buffs/debuffs.")
								pages.push(embed)
							}
						}
					}
				});
				if (pages.length > 0) { sende(message, pages) }
				else { message.channel.send("Wrong Name") }
			}
		})
	}
}
function nameChange(unit) {
	let unit2 = unit.toLowerCase()
	if (name3[unit2]) { unit2 = name3[unit2]; }
	unit2 = unit2.toLowerCase()
	if (name2[unit2]) { unit2 = name2[unit2]; }
	return unit2
}
function rankRemove(unit) {
	var unit2 = unit
	var li = unit.split(" ")
	if (li.length > 1 && (li[li.length - 1] == "b" || li[li.length - 1] == "a" || li[li.length - 1] == "s" || li[li.length - 1] == "ss" || li[li.length - 1] == "sss")) {
		li.pop()
		unit2 = " ".join(li)
	}
	return unit2
}
function te(output) {
	if (output == null) { return null }
	output = output.replace(/<[^>]*>/g, "\n");
	output = output.replace(/\n+ /g, "\n");
	output = he.decode(output);
	output = output.trim();
	var arr = output.split('\n');
	var filtered = arr.filter(function (el) {
		return el != null && el != '' && el.substring(0, 12) != "This ability";
	});
	return filtered.join("\n");
}
function sende(message, pages) {
	var embed = pages[0];
	let page = 1;
	embed = pages[0];
	embed.setFooter('Page ' + page + ' of ' + pages.length);
	if (pages.length != 1) {
		message.channel.send(embed).then(msg => {
			msg.react('⬅️').then(r => {
				msg.react('➡️')

				// Filters
				const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && !user.bot;
				const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡️' && !user.bot;

				const backwards = msg.createReactionCollector(backwardsFilter, { timer: 6000 });
				const forwards = msg.createReactionCollector(forwardsFilter, { timer: 6000 });

				backwards.on('collect', r => {
					r.remove(r.users.filter(u => !u.bot).first());
					if (page === 1) {
						page = pages.length + 1;
					}
					page--;
					embed = pages[page - 1];
					embed.setFooter('Page ' + page + ' of ' + pages.length);
					msg.edit(embed)
				})

				forwards.on('collect', r => {
					r.remove(r.users.filter(u => !u.bot).first());
					if (page === pages.length) {
						page = 0;
					}
					page++;
					embed = pages[page - 1];
					embed.setFooter('Page ' + page + ' of ' + pages.length);
					msg.edit(embed)
				})
			})
		})
	}
	else { message.channel.send(embed) }
}
module.exports = Equip;
