const commando = require('discord.js-commando');
const bot = new commando.CommandoClient({
    commandPrefix: '&',
    owner: '371341098854907939',
    disableEveryone: true,
    unknownCommandResponse: false
});
bot.on('ready', () => {
    bot.user.setActivity('&help for, well, help');
});
bot.registry.registerGroup('find', 'Find');
bot.registry.registerGroup('quiz', 'Quiz');
bot.registry.registerGroup('role', 'Role');
bot.registry.registerGroup('util2', 'Util');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");
bot.login(process.env.BOT_TOKEN);
