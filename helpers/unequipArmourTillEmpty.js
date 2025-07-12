"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unequipArmourUntilEmpty = unequipArmourUntilEmpty;
const ARMOUR = [5, 6, 7, 8]; // helmet, chest, legs, boots
const OFFHAND = 45;
function unequipArmourUntilEmpty(bot) {
    return __awaiter(this, void 0, void 0, function* () {
        function tryUnequipSlot(slot) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!bot.inventory.slots[slot])
                    return;
                console.log(`Attempting to unequip slot ${slot}`);
                // Try shift-click first (mode 1)
                yield bot.clickWindow(slot, 0, 1);
                yield bot.waitForTicks(5); // Increased wait time
                // If shift-click didn't work, try left-click then click empty slot
                if (bot.inventory.slots[slot]) {
                    console.log(`[Shift-click failed for slot ${slot}, trying manual move`);
                    // Left click to pick up the item
                    yield bot.clickWindow(slot, 0, 0);
                    yield bot.waitForTicks(3);
                    // Find an empty inventory slot and click it
                    const emptySlot = bot.inventory.firstEmptySlotRange(9, 44); // inventory slots 9-44
                    if (emptySlot !== null) {
                        yield bot.clickWindow(emptySlot, 0, 0);
                        yield bot.waitForTicks(3);
                    }
                    else {
                        // If no empty slot, try to drop the item
                        console.log(`[No empty slots, dropping item from slot ${slot}`);
                        yield bot.clickWindow(-999, 0, 0); // Click outside window to drop
                        yield bot.waitForTicks(3);
                    }
                }
                // Double-check and retry if still equipped
                if (bot.inventory.slots[slot]) {
                    console.log(`Retrying slot ${slot}`);
                    yield bot.waitForTicks(5);
                    yield tryUnequipSlot(slot); // recursive retry with longer wait
                }
            });
        }
        // Unequip armor in reverse order (boots first, helmet last)
        const armorSlots = [...ARMOUR].reverse();
        for (const slot of [...armorSlots, OFFHAND]) {
            yield tryUnequipSlot(slot);
            yield bot.waitForTicks(3); // Wait between each slot
        }
        // Final check
        const stillEquipped = ARMOUR.filter((s) => bot.inventory.slots[s] != null);
        if (stillEquipped.length > 0) {
            console.warn(`[Warning: Armour still equipped in slots: ${stillEquipped.join(", ")}`);
            // One more aggressive attempt
            for (const slot of stillEquipped) {
                console.log(`[Final attempt to unequip slot ${slot}`);
                if (bot.inventory.slots[slot]) {
                    yield bot.clickWindow(slot, 0, 0); // Pick up
                    yield bot.waitForTicks(2);
                    yield bot.clickWindow(-999, 0, 0); // Drop
                    yield bot.waitForTicks(2);
                }
            }
        }
    });
}
