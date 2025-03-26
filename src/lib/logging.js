const logger = (...args) => {
  if (typeof Logger !== "undefined") {
    // `Logger` is a global object provided by Google Apps Script.
    // It is used to log messages to the Stackdriver Logging service.
    // It is only available in the Google Apps Script environment.
    // eslint-disable-next-line no-undef
    Logger.log(...args);
  } else {
    // Fallback to `console.log` if `Logger` is not available.
    console.log(...args);
  }
}

/**
 * This wrapper class allows to transparently switch between
 * logging with `console` and the `Logger` object provided by
 * Apps Script. Both will store the logs to Google Cloud Logging,
 * but there are subtle differences between the two. Read the docs at:
 * - https://developers.google.com/apps-script/guides/logging
 * - https://developers.google.com/apps-script/reference/base/logger
 * - https://developers.google.com/apps-script/reference/base/console
 */
class Logging {
  /**
   * Constructor
   * @param {Config} config Config reader object
   */
  constructor(config) {
    this.useCloudLogger = config.getUserProp("USE_CLOUD_LOGGER", false);
  }

  log(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else {
      console.log(...args);
    }
  }

  info(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else {
      console.info(...args);
    }
  }

  warn(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else {
      console.warn(...args);
    }
  }

  error(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else {
      console.error(...args);
    }
  }

  debug(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else {
      // `console.debug` is not available in the Google Apps Script environment.
      console.log(...args);
    }
  }
}

module.exports = Logging;
