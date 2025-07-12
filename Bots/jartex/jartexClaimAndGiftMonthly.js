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
const movement_1 = require("../../helpers/movement");
const unequipArmourTillEmpty_1 = require("../../helpers/unequipArmourTillEmpty");
const waitForArmour_1 = require("../../helpers/waitForArmour");
const dumpInventory_1 = require("../../helpers/dumpInventory");
const claimAndGiftMonthlyJartex = (_a) => __awaiter(void 0, [_a], void 0, function* ({ bot, giftTo, }) {
    let phase = null;
    // Step 1: Join server
    bot.chat("/server kitpvp");
    console.log(`[${bot.username}] → /server kitpvp`);
    yield bot.waitForTicks(60);
    // Step 2: Move to open space (avoid chest collisions)
    console.log(`[${bot.username}] Moving backward`);
    yield (0, movement_1.walkBackward)(bot, 5);
    // Step 3: Open kit menu
    bot.chat("/kit");
    console.log(`[${bot.username}] → /kit`);
    phase = "kitMenu";
    const onWindowOpen = (win) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (phase === "kitMenu") {
                const kitSlot = 2 * 9 + 3;
                yield bot.clickWindow(kitSlot, 0, 0);
                console.log(`[${bot.username}] Picked kit slot ${kitSlot}`);
                yield bot.waitForTicks(10);
                bot.closeWindow(win);
                yield (0, waitForArmour_1.waitForArmourSlots)(bot);
                yield (0, unequipArmourTillEmpty_1.unequipArmourUntilEmpty)(bot);
                bot.chat(`/gift ${giftTo}`);
                console.log(`[${bot.username}] → /gift sent to ${giftTo}`);
                phase = "giftChest";
                return;
            }
            if (phase === "giftChest") {
                console.log(`[${bot.username}] Gift chest opened — dumping items`);
                yield (0, dumpInventory_1.dumpInventory)(bot, win);
                yield bot.waitForTicks(40);
                bot.closeWindow(win);
                phase = "giftConfirm";
                return;
            }
            if (phase === "giftConfirm") {
                const confirmSlot = 1 * 9 + 2;
                yield bot.waitForTicks(10);
                yield bot.clickWindow(confirmSlot, 0, 0);
                console.log(`[${bot.username}] ✅ Gift confirmed`);
                bot.closeWindow(win);
                bot.quit();
                phase = null;
            }
        }
        catch (err) {
            console.error(`[${bot.username}] Error in windowOpen:`, err);
        }
    });
    bot.on("windowOpen", onWindowOpen);
});
exports.default = claimAndGiftMonthlyJartex;
