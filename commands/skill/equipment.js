const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
require('@gouch/to-title-case')
var urlencode = require('urlencode');
var name = require('../../library/lib.js').name;
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
		var li2 = li[li.length-1]
		var link 
		if (li2 == "chip") {
			link = "https://lastorigin.fandom.com/wiki/Sub:Equipment/Chips"
		}
		else if (li2 == "os") {
			link = "https://lastorigin.fandom.com/wiki/Sub:Equipment/OS"
		}
		else {link = "https://lastorigin.fandom.com/wiki/Sub:Equipment/Gears"}

		request(link, function(err, resp, html) {
			if (!err) {
				var check = false
				const $ = cheerio.load(html);
				let siz = $(".wikitable.sortable tbody").find('tr').length
				for (var i = 2; i<=siz; i++) {
					let name = $(".wikitable.sortable tbody tr:nth-child(" + i + ") td:nth-child(2)").html()
					name = te(name)
					if (name.toLowerCase() == gear) {
						check = true
						let img = $(".wikitable.sortable tbody tr:nth-child(" + i + ") td a").attr('href')
						let eff = $(".wikitable.sortable tbody tr:nth-child(" + i + ") td:nth-child(3)").html()
						eff= te(eff)
						let note = $(".wikitable.sortable tbody tr:nth-child(" + i + ") td:nth-child(4)").html()
						note= te(note)
						let embed = new Discord.RichEmbed()
						embed.setTitle(name)
						embed.setThumbnail(img)
						embed.setURL(link)
						embed.addField("Effect", eff)
						embed.addField("Note", note)
						embed.setFooter("Effects within square brackets are applied as combat buffs/debuffs.")
						message.channel.send(embed)
						break
					}
				}
				if (!check) {message.channel.send("Wrong name")}
			}
		})
	}
}
function nameChange(unit) {
	if (name2[unit]) {unit = name2[unit];}
	return unit
}
function te(output) {
	if (output == null) {return null}
	output = output.replace(/<[^>]*>/g, "\n");
	output = output.replace(/\n+ /g, "\n");
	output = he.decode(output);
	output = output.trim();
	var arr = output.split('\n');
	var filtered = arr.filter(function(el) {
		return el != null && el != '' && el.substring(0,12) != "This ability";
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
			msg.react('⬅️').then( r => {
				msg.react('➡️')

				// Filters
				const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && !user.bot;
				const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡️' && !user.bot;

				const backwards = msg.createReactionCollector(backwardsFilter, {timer: 6000});
				const forwards = msg.createReactionCollector(forwardsFilter, {timer: 6000});

				backwards.on('collect', r => {
				r.remove(r.users.filter(u => !u.bot).first());
					if (page === 1) {
						page = pages.length + 1;
					}
					page--;
						embed = pages[page-1];
						embed.setFooter('Page ' + page + ' of ' + pages.length);
						msg.edit(embed)
				})

				forwards.on('collect', r => {
				r.remove(r.users.filter(u => !u.bot).first());
						if (page === pages.length) {
							page = 0;
						}
						page++;
						embed = pages[page-1];
						embed.setFooter('Page ' + page + ' of ' + pages.length);
						msg.edit(embed)
				})
			})
		})
	}
	else {message.channel.send(embed)}
}
module.exports = Equip;
