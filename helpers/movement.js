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
exports.walkBackward = walkBackward;
/** Walk straight backward for a given number of blocks. */
function walkBackward(bot_1) {
    return __awaiter(this, arguments, void 0, function* (bot, blocks = 5) {
        return new Promise((resolve) => {
            const start = bot.entity.position.clone();
            bot.setControlState("back", true);
            const onPhysics = () => {
                const { x, z } = bot.entity.position.minus(start);
                if (Math.hypot(x, z) >= blocks - 0.1) {
                    bot.setControlState("back", false);
                    bot.removeListener("physicsTick", onPhysics);
                    resolve();
                }
            };
            bot.on("physicsTick", onPhysics);
        });
    });
}
