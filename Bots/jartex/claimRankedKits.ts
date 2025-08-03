import { Bot } from "mineflayer";
import type { Window } from "prismarine-windows";
import { walkBackward } from "../../helpers/movement";

interface IClaimJartexRankedKitsProps {
  bot: Bot;
  claimSlots?: number[];
}

function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg = 'Timeout'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(errorMsg)), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

const claimJartexRankedKits = async ({
  bot,
  claimSlots = [],
}: IClaimJartexRankedKitsProps) => {
  const MAX_RUNTIME = 120_000; // 2 minutes timeout

  const forceQuitTimer = setTimeout(() => {
    console.warn(`[${bot.username}] Force quitting after max runtime.`);
    try {
      bot.quit();
    } catch (e) {
      console.error(`[${bot.username}] Error during force quit:`, e);
    }
  }, MAX_RUNTIME);

  bot.on("kicked", (reason) => {
    console.warn(`[${bot.username}] Kicked: ${reason}`);
  });

  bot.on("error", (err) => {
    console.error(`[${bot.username}] Bot error:`, err);
  });

  bot.on("end", () => {
    console.log(`[${bot.username}] Disconnected from server.`);
  });

  try {
    bot.chat("/server kitpvp");
    console.log(`[${bot.username}] → /server kitpvp`);
    await bot.waitForTicks(80);

    await withTimeout(walkBackward(bot, 5), 10_000);
    await bot.waitForTicks(20);

    for (const slot of claimSlots) {
      await withTimeout(
        new Promise<void>((resolve) => {
          const handleKitWindow = async (win: Window) => {
            try {
              console.log(`[${bot.username}] Window opened. Preparing to click slot ${slot}`);
              await bot.waitForTicks(15);

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
        }),
        15_000,
        `Timeout while claiming kit slot ${slot}`
      );

      await bot.waitForTicks(30);
    }

    console.log(`[${bot.username}] ✅ Finished claiming all slots.`);
  } catch (err) {
    console.error(`[${bot.username}] ❌ Fatal error in kit claiming:`, err);
  } finally {
    clearTimeout(forceQuitTimer);
    try {
      bot.quit();
    } catch (e) {
      console.error(`[${bot.username}] Error on quit:`, e);
    }
  }
};

export default claimJartexRankedKits;
