/**
 * Stub of the GMailApp class to be used in place
 * of the `GMailApp` service in Google Apps Script.
 * Implement this class to run the application
 * in a Node.js environment.
 */

class GMailAppStub {
  constructor(config, logging) {
    this.config = config;
    this.logging = logging;
  }

  search(query, start, max) {
    this.logging.info("Searching Gmail threads...", query, start, max);
    throw new Error("Not implemented");
  }

  getUserLabelByName(name) {
    this.logging.info("Getting Gmail label...", name);
    throw new Error("Not implemented");
  }

  createLabel(name) {
    this.logging.info("Creating Gmail label...", name);
    throw new Error("Not implemented");
  }
}

module.exports = GMailAppStub;
