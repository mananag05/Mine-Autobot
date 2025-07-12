import { Bot } from "mineflayer";
import type { Window } from "prismarine-windows";
import { walkBackward } from "../../helpers/movement";
import { unequipArmourUntilEmpty } from "../../helpers/unequipArmourTillEmpty";
import { waitForArmourSlots } from "../../helpers/waitForArmour";
import { dumpInventory } from "../../helpers/dumpInventory";

const claimAndGiftMonthlyJartex = async ({
  bot,
  giftTo,
}: {
  bot: Bot;
  giftTo: string;
}) => {
  let phase: "kitMenu" | "giftChest" | "giftConfirm" | null = null;

  // Step 1: Join server
  bot.chat("/server kitpvp");
  console.log(`[${bot.username}] → /server kitpvp`);
  await bot.waitForTicks(60);

  // Step 2: Move to open space (avoid chest collisions)
  console.log(`[${bot.username}] Moving backward`);
  await walkBackward(bot, 5);

  // Step 3: Open kit menu
  bot.chat("/kit");
  console.log(`[${bot.username}] → /kit`);
  phase = "kitMenu";

  const onWindowOpen = async (win: Window) => {
    try {
      if (phase === "kitMenu") {
        const kitSlot = 2 * 9 + 3;
        await bot.clickWindow(kitSlot, 0, 0);
        console.log(`[${bot.username}] Picked kit slot ${kitSlot}`);
        await bot.waitForTicks(10);
        bot.closeWindow(win);

        await waitForArmourSlots(bot);
        await unequipArmourUntilEmpty(bot);

        bot.chat(`/gift ${giftTo}`);
        console.log(`[${bot.username}] → /gift sent to ${giftTo}`);
        phase = "giftChest";
        return;
      }

      if (phase === "giftChest") {
        console.log(`[${bot.username}] Gift chest opened — dumping items`);
        await dumpInventory(bot, win);
        await bot.waitForTicks(40);
        bot.closeWindow(win);
        phase = "giftConfirm";
        return;
      }

      if (phase === "giftConfirm") {
        const confirmSlot = 1 * 9 + 2;
        await bot.waitForTicks(10);
        await bot.clickWindow(confirmSlot, 0, 0);
        console.log(`[${bot.username}] ✅ Gift confirmed`);
        bot.closeWindow(win);
        bot.quit();
        phase = null;
      }
    } catch (err) {
      console.error(`[${bot.username}] Error in windowOpen:`, err);
    }
  };

  bot.on("windowOpen", onWindowOpen);
};

export default claimAndGiftMonthlyJartex;
