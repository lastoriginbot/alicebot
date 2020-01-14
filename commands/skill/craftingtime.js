const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
require('@gouch/to-title-case')
var urlencode = require('urlencode');
var name = require('../../library/lib.js').name;
var name2 = require('../../library/lib3.js').name;
class Time extends commando.Command {
    constructor(client) {
        super(client, {
            	name: 'craftingtime',
            	group: 'find',
		aliases: ['ct'],
            	memberName: 'craftingtime',
            	description: 'find a unit with a certain crafting time',
		args: [{
		    key: 'text',
			prompt: 'What crafting time do you want to check?',
		    type: 'string'
		}]
        });
    }
	async run(message, { text }) {
		var time = text.toLowerCase();
		var link = "https://lastorigin.fandom.com/wiki/Workshop"
		console.log(link)
		request(link, function(err, resp, html) {
			if (!err) {
				let check = false;
				let pages = [];
				const $ = cheerio.load(html);
        			let siz = $(".mw-content-ltr.mw-content-text table tbody").first().find("tr").length;
        			for (var i =2 ; i<=siz; i++) {
          				let ti = $(".mw-content-ltr.mw-content-text table tbody tr:nth-child(" +i+ ") td:nth-child(4)").first().text()
          				if (time.toLowerCase() == ti.trim().toLowerCase())
          				{
						let unit = $(".mw-content-ltr.mw-content-text table tbody tr:nth-child(" +i+ ") td:nth-child(2)").first().text().trim()
						console.log(unit)
						let link2 = "https://lastorigin.fandom.com/wiki/" + urlencode(unit)
						let img = $(".mw-content-ltr.mw-content-text table tbody tr:nth-child(" +i+ ") td:nth-child(1) div a img").first().attr("data-src")
						if (!img) {
							img = $(".mw-content-ltr.mw-content-text table tbody tr:nth-child(" +i+ ") td:nth-child(1) div a img").first().attr("src")
						}
						img = img.split("/scale-to-width-down/")[0]
						img = img + "/scale-to-width-down/120"
						console.log(img)
						let embed = new Discord.RichEmbed()
						embed.setTitle(unit)
						embed.setImage(img)
						embed.setURL(link2)
						pages.push(embed)
            				}
				}
        			if (pages.length > 0) {sende(message, pages)}
        			else {
					let unit = nameChange(time);
					let siz = $(".mw-content-ltr.mw-content-text table tbody").first().find("tr").length;
        				for (var i =2 ; i<=siz; i++) {
          					let na = $(".mw-content-ltr.mw-content-text table tbody tr:nth-child(" +i+ ") td:nth-child(2)").first().text().trim()
          					if (unit.toLowerCase() == na.toLowerCase())
          					{
            						pages.push($(".mw-content-ltr.mw-content-text table tbody tr:nth-child(" +i+ ") td:nth-child(4)").first().text().trim())
            					}
					}
					if (pages.length > 0) {message.channel.send(pages.join("\n"))}
					else {message.channel.send("Wrong Input")}
				}
      			}
    		})
	}
}
function nameChange(unit) {
	if (name[unit]) {unit = name[unit];}
	if (name2[unit]) {unit = name2[unit];}
	return unit
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
module.exports = Time;
