import { Bot } from "mineflayer";

const ARMOUR = [5, 6, 7, 8]; // helmet, chest, legs, boots
const OFFHAND = 45;

export async function unequipArmourUntilEmpty(bot: Bot): Promise<void> {
  async function tryUnequipSlot(slot: number): Promise<void> {
    if (!bot.inventory.slots[slot]) return;

    console.log(`Attempting to unequip slot ${slot}`);

    // Try shift-click first (mode 1)
    await bot.clickWindow(slot, 0, 1);
    await bot.waitForTicks(5); // Increased wait time

    // If shift-click didn't work, try left-click then click empty slot
    if (bot.inventory.slots[slot]) {
      console.log(
        `[Shift-click failed for slot ${slot}, trying manual move`
      );

      // Left click to pick up the item
      await bot.clickWindow(slot, 0, 0);
      await bot.waitForTicks(3);

      // Find an empty inventory slot and click it
      const emptySlot = bot.inventory.firstEmptySlotRange(9, 44); // inventory slots 9-44
      if (emptySlot !== null) {
        await bot.clickWindow(emptySlot, 0, 0);
        await bot.waitForTicks(3);
      } else {
        // If no empty slot, try to drop the item
        console.log(
          `[No empty slots, dropping item from slot ${slot}`
        );
        await bot.clickWindow(-999, 0, 0); // Click outside window to drop
        await bot.waitForTicks(3);
      }
    }

    // Double-check and retry if still equipped
    if (bot.inventory.slots[slot]) {
      console.log(`Retrying slot ${slot}`);
      await bot.waitForTicks(5);
      await tryUnequipSlot(slot); // recursive retry with longer wait
    }
  }

  // Unequip armor in reverse order (boots first, helmet last)
  const armorSlots = [...ARMOUR].reverse();
  for (const slot of [...armorSlots, OFFHAND]) {
    await tryUnequipSlot(slot);
    await bot.waitForTicks(3); // Wait between each slot
  }

  // Final check
  const stillEquipped = ARMOUR.filter((s) => bot.inventory.slots[s] != null);
  if (stillEquipped.length > 0) {
    console.warn(
      `[Warning: Armour still equipped in slots: ${stillEquipped.join(
        ", "
      )}`
    );

    // One more aggressive attempt
    for (const slot of stillEquipped) {
      console.log(`[Final attempt to unequip slot ${slot}`);
      if (bot.inventory.slots[slot]) {
        await bot.clickWindow(slot, 0, 0); // Pick up
        await bot.waitForTicks(2);
        await bot.clickWindow(-999, 0, 0); // Drop
        await bot.waitForTicks(2);
      }
    }
  }
}
