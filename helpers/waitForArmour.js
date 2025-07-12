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
exports.waitForArmourSlots = waitForArmourSlots;
const ARMOUR = [5, 6, 7, 8];
function waitForArmourSlots(bot_1) {
    return __awaiter(this, arguments, void 0, function* (bot, timeoutTicks = 300) {
        let waited = 0;
        while (ARMOUR.some((s) => bot.inventory.slots[s] == null)) {
            yield bot.waitForTicks(2);
            waited += 2;
            if (waited >= timeoutTicks) {
                console.warn(`[${bot.username}] Armour never fully arrived (timeout)`);
                break;
            }
        }
    });
}
