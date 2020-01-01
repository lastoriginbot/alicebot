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
		var check = false;
		var link = "https://docs.google.com/spreadsheets/u/2/d/e/2PACX-1vQVIjitQOW63fhQOqy31iWCeEWf44BuyVcRIB15YtB1PtoEOoh6rh9Mqw6CresP3ByK7Po6vpCQmqjn/pubhtml#"
		request(link, function(err, resp, html) {
			if (!err) {
				const $ = cheerio.load(html);
				let siz = $("html body div:nth-child(2) div:nth-child(2) div table tbody").find('tr').length /6;
				for (var i = 0; i < siz; i++){
					let name = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td").html()
					name = te(name)
					if (name.toLowerCase() == unit.toLowerCase()) {
						check = true;
						let img = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td div img").attr("src")
						let embed = new Discord.RichEmbed()
						embed.setThumbnail(img)
						embed.setTitle(name)
						let na1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(4)").html()
						let sa1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(2)").html()
						sa1 = te(sa1);
						let ra1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(3)").html()
						ra1 = te(ra1);
						embed.addField(na1, sa1 + "\n**Range/Cost: **" + ra1);
						let na2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(7)").html()
						let sa2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(5)").html()
						sa2 = te(sa2);
						let ra2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(6)").html()
						ra2 = te(ra2);
						embed.addField(na2, sa2 + "\n**Range/Cost: **" + ra2);
						let np1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(10)").html()
						if (np1 != "Passive 1: " && np1 !="Passive 1 ") {
							let sp1 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(8)").html()
							sp1 = te(sp1);
							embed.addField(np1, sp1);
							console.log(np1)
						}
						let np2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(12)").html()
						if (np2 != "Passive 2: " && np2 !="Passive 2 ") {
							let sp2 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(10)").html()
							sp2 = te(sp2);
							embed.addField(np2, sp2);
							console.log(np2)
						}
						let np3 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(14)").html()
						if (np3 != "Passive 3: " && np3 !="Passive 3 ") {
							let sp3 = $("html body div:nth-child(2) div:nth-child(2) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(12)").html()
							sp3 = te(sp3);
							embed.addField(np3, sp3);
							console.log(np3)
						}
						message.channel.send(embed)
						break;
					}
				}
				if (check == false) { 
					siz = $("html body div:nth-child(2) div:nth-child(3) div table tbody").find('tr').length /6;
					for (var i = 0; i < siz; i++){
						let name = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td").html()
						name = te(name)
						if (name == unit) {
							check = true;
							let img = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td div img").attr("src")
							let embed = new Discord.RichEmbed()
							embed.setThumbnail(img)
							embed.setTitle(unit)
							let na1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(4)").html()
							let sa1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(2)").html()
							sa1 = te(sa1);
							let ra1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(3)").html()
							ra1 = te(ra1);
							embed.addField(na1, sa1 + "\n**Range/Cost: **" + ra1);
							let na2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(7)").html()
							let sa2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(5)").html()
							sa2 = te(sa2);
							let ra2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(6)").html()
							ra2 = te(ra2);
							embed.addField(na2, sa2 + "\n**Range/Cost: **" + ra2);
							let np1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(10)").html()
							if (np1 != "Passive 1: " && np1 !="Passive 1 ") {
								let sp1 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(8)").html()
								sp1 = te(sp1);
								embed.addField(np1, sp1);
							}
							let np2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(12)").html()
							if (np2 != "Passive 2: " && np2 !="Passive 2 ") {
								let sp2 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(10)").html()
								sp2 = te(sp2);
								embed.addField(np2, sp2);
							}
							let np3 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 1) + ") td:nth-child(14)").html()
							if (np3 != "Passive 3: " && np3 !="Passive 3 ") {
								let sp3 = $("html body div:nth-child(2) div:nth-child(3) div table tbody tr:nth-child(" + (6*i + 2) + ") td:nth-child(12)").html()
								sp3 = te(sp3);
								embed.addField(np3, sp3);
							}
							message.channel.send(embed)
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
module.exports = Skill;
