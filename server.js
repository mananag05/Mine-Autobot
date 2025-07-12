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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const createBot_1 = require("./helpers/createBot");
const jartexClaimAndGiftMonthly_1 = __importDefault(require("./Bots/jartex/jartexClaimAndGiftMonthly"));
// Load variables from .env into process.env
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3001;
app.use(express_1.default.json());
const loginAndRegister_1 = require("./helpers/loginAndRegister");
const claimRankedKits_1 = __importDefault(require("./Bots/jartex/claimRankedKits"));
app.post("/jartex-monthly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = process.env.PASSWORD;
    const { host, port, giftTo } = req.body;
    if (!host || !password || !giftTo) {
        return res
            .status(400)
            .json({ error: "host, password, and giftTo are required." });
    }
    try {
        const bot = (0, createBot_1.createNewBot)({ host, port });
        bot.once("spawn", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, loginAndRegister_1.loginAndRegister)(bot, password);
                yield (0, jartexClaimAndGiftMonthly_1.default)({ bot, giftTo });
                res.json({ success: true });
            }
            catch (_a) {
                res.status(500).json({ error: "Bot flow failed." });
            }
        }));
    }
    catch (_a) {
        res.status(500).json({ error: "Bot failed to start." });
    }
}));
app.post("/jartex-claim-kits", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = process.env.PASSWORD;
    const { host, port, claimSlots, userName } = req.body;
    if (!host || !password || !Array.isArray(claimSlots)) {
        return res
            .status(400)
            .json({ error: "host, password, and claimSlots[] are required." });
    }
    try {
        const bot = (0, createBot_1.createNewBot)({ host, port, userName });
        bot.once("spawn", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, loginAndRegister_1.loginAndRegister)(bot, password);
                yield (0, claimRankedKits_1.default)({ bot, claimSlots });
                res.json({ success: true });
            }
            catch (err) {
                res.status(500).json({ error: "Bot kit claim flow failed." });
            }
        }));
    }
    catch (_a) {
        res.status(500).json({ error: "Bot failed to start." });
    }
}));
app.listen(PORT, () => {
    console.log(`🟢 Server running on http://localhost:${PORT}`);
});
