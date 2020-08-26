const eris = require('eris');
const { BOT_OWNER_ID, BOT_TOKEN, LOG_CHANNEL_ID } = require('../config.json');

const bot = new eris.Client(BOT_TOKEN);
const PREFIX = '--'

commandHandlerForCommandName = {};
commandHandlerForCommandName['hello'] = (msg, args) => {
    return msg.channel.createMessage('hello to you too');
}
commandHandlerForCommandName['shutup'] = (msg, args) => {
    return msg.channel.createMessage('no u');
}
commandHandlerForCommandName['help'] = (msg, args) => {
    const help_message = `This is the CHSVbot! I respond to mentions, and the following commands:
--shutup
--hello
I'm an experimental bot and mostly broken.
    `
    return msg.channel.createMessage(help_message);
}
bot.on('ready',() => {
    console.log('ztest is ready!');
});

bot.on('messageCreate', async (msg) => {
    var isDirectMessage = false;
    var isBotCommand = false;
    var content = msg.content;

    if(!msg.channel.guild){
        isDirectMessage = true;
    };
    
    if(msg.content.startsWith(PREFIX)){
        isBotCommand = true;
    }
    
    const botWasMentioned = msg.mentions.find(
        mentionedUser => mentionedUser.id == bot.user.id,
    );
    
    if(botWasMentioned && !isBotCommand){
        try{
            await msg.channel.createMessage('You called me?');
            return;
        }
        catch(err){
            console.warn('Failed to respond to mention');
            console.warn(err);
        }
    }
    
    if(!isBotCommand){
        return;
    }

    // Extract the parts of the command and the command name
    const parts = content.split(' ').map(s => s.trim()).filter(s => s);
    const commandName = parts[0].substr(PREFIX.length);

    const commandHandler = commandHandlerForCommandName[commandName];
    if (!commandHandler) {
        return;
    }

    const args = parts.slice(1)

    try{
        await commandHandler(msg,args);
    }
    catch(err){
        console.warn('Error occurred');
        console.warn(err);
    }

    // const username = msg.mentions.find(
    //     mentionedUser => mentionedUser.id,
    // )

});

bot.on('error',err => {
    console.warn(err);
});

bot.connect();