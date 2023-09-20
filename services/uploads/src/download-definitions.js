/**
 * Lambda function handler that will update the definitions stored in S3.
 */

const clamav = require("./clamav");
const utils = require("./utils");

/**
 * This function will do the following
 * 0. Cleanup the working folder beforehand to make sure there's enough space.
 * 1. Invoke freshclam to download the newest definitions
 * 2. Upload the newest definitions to the existing bucket CLAMAV_BUCKET_NAME
 *
 * @param event Event fired to invoke the new update function.
 * @param context
 */
async function lambdaHandleEvent(event, context) {
  utils.generateSystemMessage(`AV definition update start time: ${new Date()}`);

  await utils.cleanupFolder("/tmp/");

  if (await clamav.updateAVDefinitonsWithFreshclam()) {
    utils.generateSystemMessage("Folder content after freshclam ");
    await clamav.uploadAVDefinitions();

    utils.generateSystemMessage(`AV definition update end time: ${new Date()}`);

    return "DEFINITION UPDATE SUCCESS";
  } else {
    return "DEFINITION UPDATE FAILED";
  }
}

// Export for AWS Lambda
module.exports = {
  lambdaHandleEvent: lambdaHandleEvent,
};
