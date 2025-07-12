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
exports.loginAndRegister = void 0;
const loginAndRegister = (bot, password) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Send register and login commands (works even if already registered)
            bot.chat(`/register ${password} ${password}`);
            yield bot.waitForTicks(8);
            bot.chat(`/login ${password}`);
            yield bot.waitForTicks(30);
            // Also listen for server messages (in case login prompt appears later)
            bot.on("message", (message) => {
                const text = message.toString().toLowerCase();
                if (text.includes("/register")) {
                    bot.chat(`/register ${password} ${password}`);
                }
                else if (text.includes("/login")) {
                    bot.chat(`/login ${password}`);
                }
            });
            resolve();
        }
        catch (err) {
            console.error(`[${bot.username}] Login/Register failed:`, err);
            reject(err);
        }
    }));
});
exports.loginAndRegister = loginAndRegister;
