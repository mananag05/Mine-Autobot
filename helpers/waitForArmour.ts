import type { Bot } from "mineflayer";

const ARMOUR = [5, 6, 7, 8];

export async function waitForArmourSlots(bot: Bot, timeoutTicks = 300) {
  let waited = 0;
  while (ARMOUR.some((s) => bot.inventory.slots[s] == null)) {
    await bot.waitForTicks(2);
    waited += 2;
    if (waited >= timeoutTicks) {
      console.warn(`[${bot.username}] Armour never fully arrived (timeout)`);
      break;
    }
  }
}
