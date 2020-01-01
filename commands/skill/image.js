const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
require('@gouch/to-title-case')
var name = require('../../library/lib.js').name;
var name2 = require('../../library/lib2.js').name;
class Image extends commando.Command {
    constructor(client) {
        super(client, {
            	name: 'image',
            	group: 'find',
            	memberName: 'image',
            	description: 'list all images of a unit',
		args: [{
		    key: 'text',
			prompt: 'What unit do you want to know about?',
		    type: 'string'
		}]
        });
    }
	async run(message, { text }) {
		var unit = text.toLowerCase();
		unit = nameChange(unit);
		var check = false;
		var link = "https://www.animecharactersdatabase.com/source.php?id=106477"
		request(link, function(err, resp, html) {
			if (!err) {
				let pages = [];
				const $ = cheerio.load(html);
				let siz = $("html body div:nth-child(11) div:nth-child(5) div:nth-child(4) ul").find('li').length;
				for (var i = 1; i < siz; i++){
					let name = $("html body div:nth-child(11) div:nth-child(5) div:nth-child(4) ul li:nth-child(" + i + ") p a").html()
					name = te(name)
					if (name.toLowerCase() == unit.toLowerCase()) {
						check = true;
						let link2 = $("html body div:nth-child(11) div:nth-child(5) div:nth-child(4) ul li:nth-child(" + i + ") p a").attr("href")
						link2 = "https://www.animecharactersdatabase.com/" + link2
						request(link2, function(err, resp, html2) {
							const $2 = cheerio.load(html2);
							let img = $2("html body div:nth-child(11) div:nth-child(2) img").attr("src")
							let embed = new Discord.RichEmbed()
							embed.setTitle(name)
							embed.setImage(img)
							embed.setURL(link2)
							pages.push(embed)
							let siz2 = $2("html body div:nth-child(11) div:nth-child(5) div:nth-child(3) table tbody tr td div ul").find('li').length;
							for (var j = 1; j < siz2; j++) {
								let img2 = $2("html body div:nth-child(11) div:nth-child(5) div:nth-child(3) table tbody tr td div ul li:nth-child(" + j + ") a img").attr("src")
								img2 = img2.split(".jpg")[0] + ".png"
								let ii = img2.split("/thumbs/100")
								img2 = ii[0] + ii[1]
								let embed2 = new Discord.RichEmbed()
								embed2.setTitle(name)
								embed2.setImage(img2)
								embed2.setURL(link2)
								pages.push(embed2)
							}
							sende(message, pages);
						})
						break;
					}
				}
				if (check == false) {message.channel.send("Wrong Name")}
			}
		})
	}
}
function nameChange(unit) {
	if (name[unit]) {unit = name[unit];}
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
module.exports = Image;
