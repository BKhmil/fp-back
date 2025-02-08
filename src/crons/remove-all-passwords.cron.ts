import { CronJob } from "cron";

import { envConfig } from "../configs/env.config";
import { timeHelper } from "../helpers/time.helper";
import { oldPasswordRepository } from "../repositories/old-password.repository";

const handler = async () => {
  try {
    const { value, unit } = timeHelper.parseConfigString(
      envConfig.OLD_PASSWORD_EXPIRATION,
    );
    const date = timeHelper.subtractCurrentByParams(value, unit);
    const deletedCount = await oldPasswordRepository.deleteBeforeDate(date);
    console.log("Deleted " + deletedCount + " old passwords");
  } catch (err) {
    console.error(err);
  }
};

export const removeOldPasswordsCronJob = new CronJob("0 3 * * *", handler);
