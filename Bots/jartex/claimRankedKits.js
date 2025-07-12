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
const claimJartexRankedKits = (_a) => __awaiter(void 0, [_a], void 0, function* ({ bot, claimSlots = [], }) {
    bot.chat("/server kitpvp");
    console.log(`[${bot.username}] → /server kitpvp`);
    yield bot.waitForTicks(80); // ⏳ wait a bit more after switching server
    yield (0, movement_1.walkBackward)(bot, 5);
    yield bot.waitForTicks(20); // small pause after movement
    for (const slot of claimSlots) {
        yield new Promise((resolve) => {
            const handleKitWindow = (win) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    console.log(`[${bot.username}] Window opened. Preparing to click slot ${slot}`);
                    yield bot.waitForTicks(15); // ⏳ wait for inventory to load
                    yield bot.clickWindow(slot, 0, 0);
                    console.log(`[${bot.username}] Clicked kit slot ${slot}`);
                    yield bot.waitForTicks(10);
                    if (bot.currentWindow) {
                        bot.closeWindow(bot.currentWindow);
                        console.log(`[${bot.username}] Closed window manually`);
                    }
                }
                catch (err) {
                    console.error(`[${bot.username}] Error while claiming kit:`, err);
                }
                finally {
                    bot.removeListener("windowOpen", handleKitWindow);
                    resolve();
                }
            });
            bot.once("windowOpen", handleKitWindow);
            bot.chat("/kit");
            console.log(`[${bot.username}] → /kit (to claim slot ${slot})`);
        });
        yield bot.waitForTicks(30); // ⏳ give a pause before next loop
    }
    console.log(`[${bot.username}] ✅ Finished claiming all slots.`);
    bot.quit();
});
exports.default = claimJartexRankedKits;
