/**
 * Writes logs using the `Logger` object provided by Google Apps Script
 * or `console` if `Logger` is not available.
 * @param  {...any} args - Args to log
 */
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
 * but there are subtle differences between the two.
 * @see https://developers.google.com/apps-script/guides/logging
 * @see https://developers.google.com/apps-script/reference/base/logger
 * @see https://developers.google.com/apps-script/reference/base/console
 */
class Logging {
  /**
   * Constructor
   * @param {Config} config - Config reader object
   */
  constructor(config) {
    this.useCloudLogger = config.getUserProp("USE_CLOUD_LOGGER", false);
  }

  /**
   * Writes a log with a default severity.
   * @param  {...any} args - Args to log
   */
  log(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else {
      console.log(...args);
    }
  }

  /**
   * Writes a log with `info` severity.
   * In JavaScript, it's an alias for `log`.
   * @param  {...any} args - Args to log
   */
  info(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else {
      console.info(...args);
    }
  }

  /**
   * Writes a log with `warning` severity.
   * In JavaScript, it's an alias for `error`.
   * @param  {...any} args - Args to log
   */
  warn(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else {
      console.warn(...args);
    }
  }

  /**
   * Writes a log with `error` severity.
   * @param  {...any} args - Args to log
   */
  error(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else {
      console.error(...args);
    }
  }

  /**
   * Writes a log with `debug` severity,
   * if available in the environment.
   * Otherwise, it falls back to the default one.
   * @param  {...any} args - Args to log
   */
  debug(...args) {
    if (this.useCloudLogger) {
      logger(...args);
    } else if (typeof console.debug === "function") {
      console.debug(...args);
    } else {
      // `console.debug` is not available in the Google Apps Script environment.
      console.log(...args);
    }
  }
}

module.exports = Logging;
