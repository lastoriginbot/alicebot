const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
require('@gouch/to-title-case')
var urlencode = require('urlencode');
var name = require('../../library/lib.js').name;
var name2 = require('../../library/lib3.js').name;
class Image extends commando.Command {
    constructor(client) {
        super(client, {
            	name: 'image',
            	group: 'find',
		aliases: ['images', 'img', 'i', 'skin', 'skins'],
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
		var link = "https://lastorigin.fandom.com/wiki/" + urlencode(unit)
		console.log(link)

		request(link, function(err, resp, html) {
			if (!err) {
				let check = false;
				let pages = [];
				const $ = cheerio.load(html);
				if ($(".unitname").html()) {unit = te($(".unitname").html())}
				$(".image.lightbox").each(function(i, elem){
			  		let img = $(elem).find("img").attr("data-src");
					img = img.split("/scale-to-width-down/")[0]
					console.log(img)
			  		let embed = new Discord.RichEmbed()
					embed.setTitle(unit)
					embed.setImage(img)
					embed.setURL(link)
					pages.push(embed)
				})
				if (pages.length > 0) {sende(message, pages)}
				else {message.channel.send("Wrong Name")}
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
module.exports = Image;
