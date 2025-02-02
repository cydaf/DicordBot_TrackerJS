const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const PREFIX = "!";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("正在玩 LeetCode");
});

// read the directory ./commands for all .js files
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// set command into commands
let commands = new Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  else if (!msg.content.startsWith(PREFIX)) return;

  const parsedLine = msg.content.trim(" ").split("\n")[0];
  const parsedCmd = parsedLine.split(" ")[0];

  // if command not found, return, execute otherwise
  if (!commands.has(parsedCmd)) return;
  try {
    commands.get(parsedCmd).execute(msg);
  } catch (err) {
    console.error("whoops! error!");
  }
});

client.login(process.env.DC_TOKEN);
