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
        let siz = $(".mw-content-ltr.mw-content-text table tbody").find("tr").length;
        for (var i =2 ; i<=siz; i++) {
          let ti = $(".mw-content-ltr.mw-content-text table tbody tr:nth-child(" +i+ ") td:nth-child(4)").text()
          if (time.toLowerCase() == ti.trim().toLowerCase())
          {
            pages.push($(".mw-content-ltr.mw-content-text table tbody tr:nth-child(" +i+ ") td:nth-child(2)").text().trim())
            }
        }
        if (pages.length > 0) {message.channel.send(pages.join("\n"))}
        else {message.channel.send("Wrong Time Input")}
      }
    })
	}
}
module.exports = Time;
