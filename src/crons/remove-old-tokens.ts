import { CronJob } from "cron";

import { envConfig } from "../configs/env.config";
import { timeHelper } from "../helpers/time.helper";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";

const handler = async () => {
  try {
    const { value: authValue, unit: authUnit } = timeHelper.parseConfigString(
      envConfig.JWT_REFRESH_EXPIRATION,
    );
    const { value: actionForgotValue, unit: actionForgotUnit } =
      timeHelper.parseConfigString(envConfig.ACTION_FORGOT_PASSWORD_EXPIRATION);
    const { value: actionVerifyEmailValue, unit: actionVerifyEmailUnit } =
      timeHelper.parseConfigString(envConfig.ACTION_VERIFY_EMAIL_EXPIRATION);
    const { value: actionAccountRestoreValue, unit: actionAccountRestoreUnit } =
      timeHelper.parseConfigString(envConfig.ACTION_ACCOUNT_RESTORE_EXPIRATION);

    const authDate = timeHelper.subtractCurrentByParams(authValue, authUnit);
    const actionForgotDate = timeHelper.subtractCurrentByParams(
      actionForgotValue,
      actionForgotUnit,
    );
    const actionVerifyEmailDate = timeHelper.subtractCurrentByParams(
      actionVerifyEmailValue,
      actionVerifyEmailUnit,
    );
    const actionAccountRestoreDate = timeHelper.subtractCurrentByParams(
      actionAccountRestoreValue,
      actionAccountRestoreUnit,
    );

    const authCount = await tokenRepository.deleteBeforeDate(authDate);
    const actionForgotCount =
      await actionTokenRepository.deleteBeforeDate(actionForgotDate);
    const actionVerifyEmailCount = await actionTokenRepository.deleteBeforeDate(
      actionVerifyEmailDate,
    );
    const actionAccountRestoreCount =
      await actionTokenRepository.deleteBeforeDate(actionAccountRestoreDate);

    console.log("Deleted " + authCount + " old auth tokens");
    console.log(
      "Deleted " + actionForgotCount + " old action FORGOT_PASSWORD tokens",
    );
    console.log(
      "Deleted " + actionVerifyEmailCount + " old action VERIFY_EMAIL tokens",
    );
    console.log(
      "Deleted " +
        actionAccountRestoreCount +
        " old action ACCOUNT_RESTORE tokens",
    );
  } catch (err) {
    console.error(err.message);
  }
};

export const removeOldTokens = new CronJob("0 12 * * *", handler);
