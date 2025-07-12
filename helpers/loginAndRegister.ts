import { Bot } from "mineflayer";

export const loginAndRegister = async (bot: Bot, password: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // Send register and login commands (works even if already registered)
      bot.chat(`/register ${password} ${password}`);
      await bot.waitForTicks(8);
      bot.chat(`/login ${password}`);
      await bot.waitForTicks(30);

      // Also listen for server messages (in case login prompt appears later)
      bot.on("message", (message) => {
        const text = message.toString().toLowerCase();
        if (text.includes("/register")) {
          bot.chat(`/register ${password} ${password}`);
        } else if (text.includes("/login")) {
          bot.chat(`/login ${password}`);
        }
      });

      resolve();
    } catch (err) {
      console.error(`[${bot.username}] Login/Register failed:`, err);
      reject(err);
    }
  });
};
