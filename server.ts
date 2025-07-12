import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createNewBot } from "./helpers/createBot";
import claimAndGiftMonthlyJartex from "./Bots/jartex/jartexClaimAndGiftMonthly";

// Load variables from .env into process.env
dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());

import { loginAndRegister } from "./helpers/loginAndRegister";
import claimJartexRankedKits from "./Bots/jartex/claimRankedKits";

app.post("/jartex-monthly", async (req: Request, res: Response) => {
  const password = process.env.PASSWORD;
  const { host, port, giftTo } = req.body;

  if (!host || !password || !giftTo) {
    return res
      .status(400)
      .json({ error: "host, password, and giftTo are required." });
  }

  try {
    const bot = createNewBot({ host, port });

    bot.once("spawn", async () => {
      try {
        await loginAndRegister(bot, password);
        await claimAndGiftMonthlyJartex({ bot, giftTo });
        res.json({ success: true });
      } catch {
        res.status(500).json({ error: "Bot flow failed." });
      }
    });

  } catch {
    res.status(500).json({ error: "Bot failed to start." });
  }
});

app.post("/jartex-claim-kits", async (req: Request, res: Response) => {
  const password = process.env.PASSWORD;
  const { host, port, claimSlots, userName } = req.body;

  if (!host || !password || !Array.isArray(claimSlots)) {
    return res
      .status(400)
      .json({ error: "host, password, and claimSlots[] are required." });
  }

  try {
    const bot = createNewBot({ host, port, userName });

    bot.once("spawn", async () => {
      try {
        await loginAndRegister(bot, password);
        await claimJartexRankedKits({ bot, claimSlots });
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ error: "Bot kit claim flow failed." });
      }
    });

  } catch {
    res.status(500).json({ error: "Bot failed to start." });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
