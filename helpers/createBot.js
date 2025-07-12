"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewBot = createNewBot;
const mineflayer_1 = require("mineflayer");
const uuid_1 = require("uuid");
function createNewBot({ host, port = 25565, userName, }) {
    const username = userName || "TestBot_" + (0, uuid_1.v4)().slice(0, 8);
    const bot = (0, mineflayer_1.createBot)({
        host,
        port,
        username,
        auth: "offline",
        version: "1.20.1",
    });
    bot._client.on("packet", (data, meta) => {
        var _a;
        if (meta.name === "set_slot" && ((_a = data.item) === null || _a === void 0 ? void 0 : _a.itemId) === 1092)
            return;
    });
    return bot;
}
