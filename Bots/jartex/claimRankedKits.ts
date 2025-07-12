import { Bot } from "mineflayer";
import type { Window } from "prismarine-windows";
import { walkBackward } from "../../helpers/movement";

interface IClaimJartexRankedKitsProps {
  bot: Bot;
  claimSlots?: number[];
}

const claimJartexRankedKits = async ({
  bot,
  claimSlots = [],
}: IClaimJartexRankedKitsProps) => {
  bot.chat("/server kitpvp");
  console.log(`[${bot.username}] → /server kitpvp`);
  await bot.waitForTicks(80); // ⏳ wait a bit more after switching server

  await walkBackward(bot, 5);
  await bot.waitForTicks(20); // small pause after movement

  for (const slot of claimSlots) {
    await new Promise<void>((resolve) => {
      const handleKitWindow = async (win: Window) => {
        try {
          console.log(`[${bot.username}] Window opened. Preparing to click slot ${slot}`);
          await bot.waitForTicks(15); // ⏳ wait for inventory to load

          await bot.clickWindow(slot, 0, 0);
          console.log(`[${bot.username}] Clicked kit slot ${slot}`);
          await bot.waitForTicks(10);

          if (bot.currentWindow) {
            bot.closeWindow(bot.currentWindow);
            console.log(`[${bot.username}] Closed window manually`);
          }
        } catch (err) {
          console.error(`[${bot.username}] Error while claiming kit:`, err);
        } finally {
          bot.removeListener("windowOpen", handleKitWindow);
          resolve();
        }
      };

      bot.once("windowOpen", handleKitWindow);
      bot.chat("/kit");
      console.log(`[${bot.username}] → /kit (to claim slot ${slot})`);
    });

    await bot.waitForTicks(30); // ⏳ give a pause before next loop
  }

  console.log(`[${bot.username}] ✅ Finished claiming all slots.`);
  bot.quit();
};

export default claimJartexRankedKits;
