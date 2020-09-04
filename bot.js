require("dotenv").config();
const { Telegraf } = require("telegraf");
const api = require("covid19-api");
const MarkUp = require("telegraf/markup");
const COUNTRIES_LIST = require("./contry");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `Привет ${ctx.message.from.first_name} введи название
     своей страны на английском чтобы получить статистику, посмотреть список стран - /help`,
    MarkUp.keyboard([
      ["US", "Ukraine"],
      ["Germany", "Poland"],
    ]).extra()
  )
);
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on("text", async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    //console.log(data);
    const formatData = `
  Страна: ${data[0][0].country}
  Случаи: ${data[0][0].cases}
  Смертей: ${data[0][0].deaths}
  Вылечились: ${data[0][0].recovered}
  `;
    ctx.reply(formatData);
  } catch (err) {
    ctx.reply("Вы опечатались введите /help для просмотра списка стран ");
  }
});
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();
console.log("Бот запущен");
