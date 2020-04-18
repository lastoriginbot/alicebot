const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');

class Search extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'search',
            group: 'util2',
            memberName: 'search',
            description: 'wiki search',
            examples: ['&search alice'],
        });
    }
    async run(message, input) {
        var link = "https://lastorigin.fandom.com/wiki/Special:Search?query=" + urlencode(input)

        request(link, function(err, resp, html) {
            if (!err) {
                var out = ""
                const $ = cheerio.load(html);
                var max = 6
                for (var i = 1; i < max; i++) {
                    tex = $('.Results li:nth-child(' + i + ') article h1 a').text()
                    li = $('.Results li:nth-child(' + i + ') article h1 a').attr('href')
                    vid = $('.Results li:nth-child(' + i + ') h1 a').text()
                    console.log(li)
                    if (text != null && li != null) {
                        out = out + tex + ": " + li + "\n"
                    }
                    if (vid == "Videos for '" + text + "'") {
                        max++;
                    }
                }
                if (out != "") {
                    message.channel.send(out)
                } else {
                    message.channel.send("No Result")
                }
            }
        })
    }
}

module.exports = Search;
