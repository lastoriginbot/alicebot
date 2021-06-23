const commando = require('discord.js-commando');
const Discord = require('discord.js');
var name = require('../../library/event.js').name;

class Search extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'arca',
            group: 'util2',
            memberName: 'arca',
            description: 'arca link to story/events',
            examples: ['&arca story'],
        });
    }
    async run(message, input) {
      var ev = input.toLowerCase();
      if (name[ev]) { { message.channel.send(name[ev]) } }
      else {message.channel.send("Can not find")}
    }
}

module.exports = Search;
