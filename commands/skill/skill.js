const commando = require('discord.js-commando');
const Discord = require('discord.js');
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
    var unit = text.toLowerCase().toTitleCase();
    unit = nameChange(unit);
		var tr = unit.toLowerCase()
		var path = '../../skill/' + tr + '.js'
		var ipath = '../../image/' + tr + '.js'
		if (moduleIsAvailable(path)) {
			let embed = new Discord.RichEmbed()
      let des
      let img = require(ipath).img
      embed.setThumbnail(img)
      embed.setTitle(unit)
      let na1 = require(path).na1
      let sa1 = require(path).sa1
      let ra1 = require(path).ra1
      let aa1 = require(path).aa1
      des = sa1 + "\n**Range/AP**: " + ra1 + "\n**AoE**: " + aa1
      embed.addField("Active 1: " + na1, des);
      let na2 = require(path).na2
      let sa2 = require(path).sa2
      let ra2 = require(path).ra2
      let aa2 = require(path).aa2
      des = sa2 + "\n**Range/AP**: " + ra2 + "\n**AoE**: " + aa2
      embed.addField("Active 2: " + na2, des);
      let np1 = require(path).np1
      if (np1) {
        let sp1 = require(path).sp1
        let ap1 = require(path).ap1
        des = sp1 + "\n**AoE**: " + ap1
        embed.addField("Passive 1: " + np1, des);
      }
      let np2 = require(path).np2
      if (np2) {
        let sp2 = require(path).sp2
        let ap2 = require(path).ap2
        des = sp2 + "\n**AoE**: " + ap2
        embed.addField("Passive 2: " + np2, des);
      }
      let np3 = require(path).np3
      if (np3) {
        let sp3 = require(path).sp3
        let ap3 = require(path).ap3
        des = sp3 + "\n**AoE**: " + ap3
        embed.addField("Passive 3: " + np3, des);
      }
       message.channel.send(embed)
		}  
		else {
			message.channel.send("No Data")
		}
	}
}
function moduleIsAvailable(path) {
    try {
        require.resolve(path);
        return true;
    } catch (e) {
        return false;
    }
}
function nameChange(unit) {
  if (name[unit]) unit = name[unit];
	return unit
}
module.exports = Skill;
