const { Telegraf } = require("telegraf");
const {google} = require('googleapis');
require('dotenv').config()
const { TOKEN, API_KEY } = process.env
DISCOVERY_URL ='https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const bot = new Telegraf(TOKEN);

bot.start((ctx) => {
    ctx.reply("Hello " + ctx.message.from.first_name);
})

bot.use((ctx) => {
    
    google.discoverAPI(DISCOVERY_URL)
    .then(client => {
        const analyzeRequest = {
            comment: {
                text: ctx.message.text
            },
            requestedAttributes: {
                TOXICITY: {},
            },
        };
    
        client.comments.analyze(
            {
                key: API_KEY,
                resource: analyzeRequest,
            },
            (err, response) => {
                if (err) throw err;
                if( (JSON.stringify(response.data.attributeScores.TOXICITY.summaryScore.value, null, 2)) > 0.7){
                    ctx.deleteMessage(ctx.message.message_id);
                    ctx.reply("This message was deleted by BOT!!");
                }
            });
    })
    .catch(err => {
        console.log(err)
    });
});


bot.launch();