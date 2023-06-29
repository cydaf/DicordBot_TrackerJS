const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!group-join",
  async execute(msg) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

		// hash
    const hashID = sha256(msg.author.id).toString();
    const hashGID = sha256(msg.guild.id).toString();

		// parse
    const parsedMsg = msg.content.split(" ");
    const group = parsedMsg[1];

		// insert
    await client.from("group").insert({
      group_name: group,
      guild_id: hashGID,
      user_id: hashID,
    });

		// reply
    await msg.reply(`${msg.author.username} joins ${group}`);
  },
};
