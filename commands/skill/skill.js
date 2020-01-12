const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
require('@gouch/to-title-case')
var name = require('../../library/lib.js').name;
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
		var link = "https://docs.google.com/spreadsheets/u/2/d/e/2PACX-1vQVIjitQOW63fhQOqy31iWCeEWf44BuyVcRIB15YtB1PtoEOoh6rh9Mqw6CresP3ByK7Po6vpCQmqjn/pubhtml#"
		request(link, function(err, resp, html) {
			if (!err) {
				const $ = cheerio.load(html);
				let siz = $("html body div:nth-child(2) div:nth-child(2) div table tbody").find('tr').length /6;
				for (var i = 0; i < siz -1; i++){
					let name = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(3)").html()
					name = te(name)
					if (name.toLowerCase() == unit.toLowerCase()) {
						check = true;
						let pages = [];
						let img = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td div img").attr("src")
						let na1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(5)").html()
						let sa1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(2)").html()
						sa1 = te(sa1);
						let ra1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(3)").html()
						ra1 = te(ra1);
						let aa1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(4) div img").attr("src")
						pages = adde(img, na1, sa1, ra1, aa1, pages)
						let na2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(8)").html()
						let sa2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(5)").html()
						sa2 = te(sa2);
						let ra2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(6)").html()
						ra2 = te(ra2);
						let aa2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(7) div img").attr("src")
						pages = adde(img, na2, sa2, ra2, aa2, pages)
						let np1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(11)").html()
						if (np1 != "Passive 1: " && np1 !="Passive 1 " && np1 != "Passive 1:" && np1 !="Passive 1") {
							let sp1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(8)").html()
							sp1 = te(sp1);
							np1 = te(np1);
							let ap1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(9) div img").attr("src")
							pages = adde(img, np1, sp1, null, ap1, pages)
						}
						let np2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(13)").html()
						if (np2 != "Passive 2: " && np2 !="Passive 2 " && np2 != "Passive 2:" && np2 !="Passive 2") {
							let sp2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(10)").html()
							sp2 = te(sp2);
							np2 = te(np2);
							let ap2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(11) div img").attr("src")
							pages = adde(img, np2, sp2, null, ap2, pages)
						}
						let np3 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(15)").html()
						if (np3 != "Passive 3: " && np3 !="Passive 3 " && np3 != "Passive 3:" && np3 !="Passive 3") {
							let sp3 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(12)").html()
							sp3 = te(sp3);
							np3 = te(np3);
							let ap3 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(13) div img").attr("src")
							pages = adde(img, np3, sp3, null, ap3, pages)
						}
						sende(message, pages)
						break;
					}
				}
				if (check == false) { 
					siz = $("html body div:nth-child(2) div:nth-child(3) div table tbody").find('tr').length /6;
					for (var i = 0; i < siz -1; i++){
						let name = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(3)").html()
						name = te(name)
						if (name.toLowerCase() == unit.toLowerCase()) {
							check = true;
							let pages = [];
							let img = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td div img").attr("src")
							let na1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(5)").html()
							let sa1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(2)").html()
							sa1 = te(sa1);
							let ra1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(3)").html()
							ra1 = te(ra1);
							let aa1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(4) div img").attr("src")
							pages = adde(img, na1, sa1, ra1, aa1, pages)
							let na2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(8)").html()
							let sa2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(5)").html()
							sa2 = te(sa2);
							let ra2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(6)").html()
							let aa2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(7) div img").attr("src")
							pages = adde(img, na2, sa2, ra2, aa2, pages)
							let np1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(11)").html()
							if (np1 != "Passive 1: " && np1 !="Passive 1 " && np1 != "Passive 1:" && np1 !="Passive 1") {
								let sp1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(8)").html()
								sp1 = te(sp1);
								np1 = te(np1);
								let ap1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(9) div img").attr("src")
								pages = adde(img, np1, sp1, null, ap1, pages)
							}
							let np2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(13)").html()
							if (np2 != "Passive 2: " && np2 !="Passive 2 " && np2 != "Passive 2:" && np2 !="Passive 2") {
								let sp2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(10)").html()
								sp2 = te(sp2);
								np2 = te(np2);
								let ap2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(11) div img").attr("src")
								pages = adde(img, np2, sp2, null, ap2, pages)
							}
							let np3 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(15)").html()
							if (np3 != "Passive 3: " && np3 !="Passive 3 " && np3 != "Passive 3:" && np3 !="Passive 3") {
								let sp3 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(12)").html()
								sp3 = te(sp3);
								np3 = te(np3);
								let ap3 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(13) div img").attr("src")
								pages = adde(img, np3, sp3, null, ap3, pages)
							}
							sende(message, pages)
							break;
						}
					}
				}
				if (check == false) {
					message.channel.send("Wrong Name")
				}
			}
		})
	}
}
function nameChange(unit) {
  if (name[unit]) unit = name[unit];
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
