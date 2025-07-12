import type { Bot } from "mineflayer";

/** Walk straight backward for a given number of blocks. */
export async function walkBackward(bot: Bot, blocks = 5): Promise<void> {
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
}
