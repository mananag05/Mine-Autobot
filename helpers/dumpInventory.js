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
exports.dumpInventory = dumpInventory;
function dumpInventory(bot, win) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const start = (_a = win.inventoryStart) !== null && _a !== void 0 ? _a : win.slots.length - 36;
        for (let i = start; i < win.slots.length; i++) {
            if (win.slots[i]) {
                yield bot.clickWindow(i, 0, 1);
                yield bot.waitForTicks(2);
            }
        }
    });
}
