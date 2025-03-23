const logToCloud = (...args) => {
  try {
    // `Logger` is a global object provided by Google Apps Script.
    // It is used to log messages to the Stackdriver Logging service.
    // It is only available in the Google Apps Script environment.
    // eslint-disable-next-line no-undef
    Logger.log(...args);
  } catch (_error) {
    // Fallback to `console.log` if `Logger` is not available.
    console.log(...args);
  }
}

/**
 * This wrapper class allows to transparently switch between
 * logging to the console and logging to the Stackdriver Logging service
 * in Apps Script. It also allows local testing of the application
 * outside of Apps Script, trapping any errors that may occur because
 * of missing objects that only exist in the Apps Script environment.
 */
class Logging {
  /**
   * Constructor
   * @param {Config} config Config reader object
   */
  constructor(config) {
    this.useCloudLogging = config.getUserProp("USE_CLOUD_LOGGING", false);
  }

  log(...args) {
    if (this.useCloudLogging) {
      logToCloud(...args);
    } else {
      console.log(...args);
    }
  }

  info(...args) {
    if (this.useCloudLogging) {
      logToCloud(...args);
    } else {
      console.info(...args);
    }
  }

  warn(...args) {
    if (this.useCloudLogging) {
      logToCloud(...args);
    } else {
      console.warn(...args);
    }
  }

  error(...args) {
    if (this.useCloudLogging) {
      logToCloud(...args);
    } else {
      console.error(...args);
    }
  }

  debug(...args) {
    if (this.useCloudLogging) {
      logToCloud(...args);
    } else {
      // `console.debug` is not available in the Google Apps Script environment.
      console.log(...args);
    }
  }
}

module.exports = Logging;
