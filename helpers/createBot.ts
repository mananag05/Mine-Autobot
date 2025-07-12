import { Bot, BotOptions, createBot } from "mineflayer";
import { v4 as uuidv4 } from "uuid";

type TCreateBotOptions = {
  host: string;
  port?: number;
  userName?: string;
};

export function createNewBot({
  host,
  port = 25565,
  userName,
}: TCreateBotOptions): Bot {
  const username = userName || "TestBot_" + uuidv4().slice(0, 8);

  const bot = createBot({
    host,
    port,
    username,
    auth: "offline",
    version: "1.20.1",
  });

  bot._client.on("packet", (data, meta) => {
    if (meta.name === "set_slot" && data.item?.itemId === 1092) return;
  });

  return bot;
}
