const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
require('@gouch/to-title-case')
var urlencode = require('urlencode');
var name = require('../../library/name.js').name;
class Skill extends commando.Command {
    constructor(client) {
        super(client, {
            	name: 'skill',
            	group: 'find',
		aliases: ['s', 'skills'],
            	memberName: 'skill',
            	description: 'list all actives/passives of a unit',
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
		console.log(unit)
		var check = false;
		var link = "https://lastorigin.fandom.com/wiki/" + urlencode(unit);
        	request(link, function (err, resp, html) {
			if (!err) {
                		var pages = []
                		const $ = cheerio.load(html);
                		$('.wikitable.skilltable').each(function(i, elem) {
					check = true
                    			let $2 = cheerio.load(elem);
                    			let siz = $2('.wikitable.skilltable tbody').find('tr').length
                    			let img = $2('.wikitable.skilltable tbody tr td table tbody tr td div a img').attr('data-src')
                    			if (!img) {img = $2('.wikitable.skilltable tbody tr td table tbody tr td div a img').attr('src')}
					let state = te($2('.wikitable.skilltable tbody tr:nth-child(1) td').html().trim())
					if (state == "Name") {state = null}
					if (state == "Unit") {state = null}
					pages = []
                    			for (var i = 1; i < siz; i++){
						let siz2 = $2('.wikitable.skilltable tbody tr:nth-child(' + i + ')').find('td').length
						if (siz2 == 6) {
							let na = te($2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td:nth-child(2)').html().trim())
							if (na != "Name") {
								if (state) {na = state + "\n" + na}
								let des = te($2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td:nth-child(3)').html().trim())
								let siz3 = $2('.wikitable.skilltable tbody tr:nth-child(' + (i + 1) + ')').find('td').length
								let aoe
								if (siz3 == 1) {
									aoe = $2('.wikitable.skilltable tbody tr:nth-child(' + (i + 1) + ') td div div a img').attr('data-src')
									if (!aoe) {aoe = $2('.wikitable.skilltable tbody tr:nth-child(' + (i + 1) + ') td div div a img').attr('src')}
								}
								else {
									aoe = $2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td div div a img').attr('data-src')
									if (!aoe) {aoe = $2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td div div a img').attr('src')}
								}
								let range = te($2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td:nth-child(5)').html().trim())
								pages = adde(img, na, des, range, aoe, pages)
							}
						}
						else if (siz2 == 4) {
							let na = te($2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td:nth-child(1)').html().trim())
							if (na != "Name") {
								if (state) {na = state + "\n" + na}
								let des = te($2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td:nth-child(2)').html().trim())
								let siz3 = $2('.wikitable.skilltable tbody tr:nth-child(' + (i + 1) + ')').find('td').length
								let aoe
								if (siz3 == 1) {
									aoe = $2('.wikitable.skilltable tbody tr:nth-child(' + (i + 1) + ') td div div a img').attr('data-src')
									if (!aoe) {aoe = $2('.wikitable.skilltable tbody tr:nth-child(' + (i + 1) + ') td div div a img').attr('src')}
								}
								else {
									aoe = $2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td div div a img').attr('data-src')
									if (!aoe) {aoe = $2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td div div a img').attr('src')}
								}
								let range = te($2('.wikitable.skilltable tbody tr:nth-child(' + i + ') td:nth-child(4)').html().trim())
								pages = adde(img, na, des, range, aoe, pages)
							}
						}
                    			}
					sende(message, pages)
                		})
				if (!check) {message.channel.send("Wrong Name")}
            		}
        	})
	}
}
function nameChange(unit) {
	if (name[unit]) {unit = name[unit];}
	unit = unit.toTitleCase()
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
function adde(img, name, skill, range, aoe, pages) {
	let embed = new Discord.RichEmbed()
	embed.setThumbnail(img)
	embed.setTitle(name)
	embed.setDescription(skill)
	if (range) {
		embed.addField("Range/Cost", range);
	}
	if (aoe) {
		embed.setImage(aoe)
	}
	else {
		embed.addField("AoE", "Self")
	}
	pages.push(embed)
	return pages
}
function sende(message, pages) {
	if (pages.length == 2) {
		send2(message, pages)
	}
	else if (pages.length == 3) {
		send3(message, pages)
	}
	else if (pages.length == 4) {
		send4(message, pages)
	}
	else if (pages.length == 5) {
		send5(message, pages)
	}
	else {console.log("Send Error")}
}
function send2(message, pages) {
	let embed = pages[0]
	embed.setFooter('React 1-2 for active skills');
	message.channel.send(embed).then(msg => {
		msg.react('1️⃣').then( r1 => {
			msg.react('2️⃣')
			const f1 = (reaction, user) => reaction.emoji.name === '1️⃣' && !user.bot;
			const f2 = (reaction, user) => reaction.emoji.name === '2️⃣' && !user.bot;
			const ff1 = msg.createReactionCollector(f1, {timer: 6000});
			const ff2 = msg.createReactionCollector(f2, {timer: 6000});
			ff1.on('collect', r => {
				r.remove(r1.users.filter(u => !u.bot).first());
				embed = pages[0];
				embed.setFooter('React 1-2 for active skills');
				msg.edit(embed)
			})
			ff2.on('collect', r => {
				r.remove(r.users.filter(u => !u.bot).first());
            	embed = pages[1];
            	embed.setFooter('React 1-2 for active skills');
            	msg.edit(embed)
			})
		})
	})
}
function send3(message, pages) {
	let embed = pages[0]
	embed.setFooter('React 1-2 for active skills, 3 for passive skill');
	message.channel.send(embed).then(msg => {
		msg.react('1️⃣').then( r1 => {
			msg.react('2️⃣').then( r2 => {
				msg.react('3️⃣')
				const f1 = (reaction, user) => reaction.emoji.name === '1️⃣' && !user.bot;
				const f2 = (reaction, user) => reaction.emoji.name === '2️⃣' && !user.bot;
				const f3 = (reaction, user) => reaction.emoji.name === '3️⃣' && !user.bot;
				const ff1 = msg.createReactionCollector(f1, {timer: 6000});
				const ff2 = msg.createReactionCollector(f2, {timer: 6000});
				const ff3 = msg.createReactionCollector(f3, {timer: 6000});
				ff1.on('collect', r => {
					r.remove(r.users.filter(u => !u.bot).first());
					embed = pages[0];
					embed.setFooter('React 1-2 for active skills, 3 for passive skill');
					msg.edit(embed)
				})
				ff2.on('collect', r => {
					r.remove(r.users.filter(u => !u.bot).first());
					embed = pages[1];
					embed.setFooter('React 1-2 for active skills, 3 for passive skill');
					msg.edit(embed)
				})
				ff3.on('collect', r => {
					r.remove(r.users.filter(u => !u.bot).first());
					embed = pages[2];
					embed.setFooter('React 1-2 for active skills, 3 for passive skill');
					msg.edit(embed)
				})
			})
		})
	})
}
function send4(message, pages) {
	let embed = pages[0]
	embed.setFooter('React 1-2 for active skills, 3-4 for passive skills');
	message.channel.send(embed).then(msg => {
		msg.react('1️⃣').then( r1 => {
			msg.react('2️⃣').then( r2 => {
				msg.react('3️⃣').then( r3 => {
					msg.react('4️⃣')
					const f1 = (reaction, user) => reaction.emoji.name === '1️⃣' && !user.bot;
					const f2 = (reaction, user) => reaction.emoji.name === '2️⃣' && !user.bot;
					const f3 = (reaction, user) => reaction.emoji.name === '3️⃣' && !user.bot;
					const f4 = (reaction, user) => reaction.emoji.name === '4️⃣' && !user.bot;
					const ff1 = msg.createReactionCollector(f1, {timer: 6000});
					const ff2 = msg.createReactionCollector(f2, {timer: 6000});
					const ff3 = msg.createReactionCollector(f3, {timer: 6000});
					const ff4 = msg.createReactionCollector(f4, {timer: 6000});
					ff1.on('collect', r => {
						r.remove(r.users.filter(u => !u.bot).first());
						embed = pages[0];
						embed.setFooter('React 1-2 for active skills, 3-4 for passive skills');
						msg.edit(embed)
					})
					ff2.on('collect', r => {
						r.remove(r.users.filter(u => !u.bot).first());
						embed = pages[1];
						embed.setFooter('React 1-2 for active skills, 3-4 for passive skills');
						msg.edit(embed)
					})
					ff3.on('collect', r => {
						r.remove(r.users.filter(u => !u.bot).first());
						embed = pages[2];
						embed.setFooter('React 1-2 for active skills, 3-4 for passive skills');
						msg.edit(embed)
					})
					ff4.on('collect', r => {
						r.remove(r.users.filter(u => !u.bot).first());
						embed = pages[3];
						embed.setFooter('React 1-2 for active skills, 3-4 for passive skills');
						msg.edit(embed)
					})
				})
			})
		})
	})
}
function send5(message, pages) {
	let embed = pages[0]
	embed.setFooter('React 1-2 for active skills, 3-5 for passive skills');
	message.channel.send(embed).then(msg => {
		msg.react('1️⃣').then( r1 => {
			msg.react('2️⃣').then( r2 => {
				msg.react('3️⃣').then( r3 => {
					msg.react('4️⃣').then( r4 => {
						msg.react('5️⃣')
						const f1 = (reaction, user) => reaction.emoji.name === '1️⃣' && !user.bot;
						const f2 = (reaction, user) => reaction.emoji.name === '2️⃣' && !user.bot;
						const f3 = (reaction, user) => reaction.emoji.name === '3️⃣' && !user.bot;
						const f4 = (reaction, user) => reaction.emoji.name === '4️⃣' && !user.bot;
						const f5 = (reaction, user) => reaction.emoji.name === '5️⃣' && !user.bot;
						const ff1 = msg.createReactionCollector(f1, {timer: 6000});
						const ff2 = msg.createReactionCollector(f2, {timer: 6000});
						const ff3 = msg.createReactionCollector(f3, {timer: 6000});
						const ff4 = msg.createReactionCollector(f4, {timer: 6000});
						const ff5 = msg.createReactionCollector(f5, {timer: 6000});
						ff1.on('collect', r => {
							r.remove(r.users.filter(u => !u.bot).first());
							embed = pages[0];
							embed.setFooter('React 1-2 for active skills, 3-5 for passive skills');
							msg.edit(embed)
						})
						ff2.on('collect', r => {
							r.remove(r.users.filter(u => !u.bot).first());
							embed = pages[1];
							embed.setFooter('React 1-2 for active skills, 3-5 for passive skills');
							msg.edit(embed)
						})
						ff3.on('collect', r => {
							r.remove(r.users.filter(u => !u.bot).first());
							embed = pages[2];
							embed.setFooter('React 1-2 for active skills, 3-5 for passive skills');
							msg.edit(embed)
						})
						ff4.on('collect', r => {
							r.remove(r.users.filter(u => !u.bot).first());
							embed = pages[3];
							embed.setFooter('React 1-2 for active skills, 3-5 for passive skills');
							msg.edit(embed)
						})
						ff5.on('collect', r => {
							r.remove(r.users.filter(u => !u.bot).first());
							embed = pages[4];
							embed.setFooter('React 1-2 for active skills, 3-5 for passive skills');
							msg.edit(embed)
						})
					})
				})
			})
		})
	})
}
module.exports = Skill;
