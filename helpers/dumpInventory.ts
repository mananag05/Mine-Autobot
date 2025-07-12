import type { Bot } from "mineflayer";
import type { Window } from "prismarine-windows";

export async function dumpInventory(bot: Bot, win: Window) {
  const start = win.inventoryStart ?? win.slots.length - 36;
  for (let i = start; i < win.slots.length; i++) {
    if (win.slots[i]) {
      await bot.clickWindow(i, 0, 1);
      await bot.waitForTicks(2);
    }
  }
}
