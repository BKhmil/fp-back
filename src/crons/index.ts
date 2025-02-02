import { removeOldPasswordsCronJob } from "./remove-all-passwords.cron";
import { removeOldTokens } from "./remove-old-tokens";

export const cronRunner = async () => {
  removeOldTokens.start();
  removeOldPasswordsCronJob.start();
};
