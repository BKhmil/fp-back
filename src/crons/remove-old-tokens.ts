import { CronJob } from "cron";

import { envConfig } from "../configs/env.config";
import { timeHelper } from "../helpers/time.helper";
import { tokenRepository } from "../repositories/token.repository";

const handler = async () => {
  try {
    const { value, unit } = timeHelper.parseConfigString(
      envConfig.JWT_REFRESH_EXPIRATION,
    );
    const date = timeHelper.subtractCurrentByParams(value, unit);

    const count = await tokenRepository.deleteBeforeDate(date);
    console.log(`Deleted ${count} old tokens`);
  } catch (e) {
    console.error(e.message);
  }
};

export const removeOldTokens = new CronJob("* * * 12 * *", handler);
