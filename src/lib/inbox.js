class Inbox {
  /**
   * Constructor.
   * @param {GMailApp} gmail - GMailApp compatible object
   * @param {Config} config - Config object
   * @param {Logging} logging - Logging object
   */
  constructor(gmail, config, logging) {
    this.gmail = gmail;
    this.config = config;
    this.logging = logging;
    this._gmailLabelsCache = {};
  }

  /**
   * Searches for threads in the Gmail account.
   * @param {object} merchant - Merchant object
   * @param {string} merchant.query - Search query string
   * @return {GMailApp.GMailThread[]} - Array of GmailThread objects
   * @see https://support.google.com/mail/answer/7190?hl=en&co=GENIE.Platform%3DAndroid
   */
  searchThreads(merchant) {
    const query = [
      merchant.query,
      `NOT label:${this.config.getGmailLabel()}`,
    ].join(" AND ");
    return this.gmail.search(query, 0, this.config.getProcessingBatchSize());
  }

  /**
   * Retrieves a label in the Gmail account,
   * contextually creates it if not found.
   * @param {string} name - Label name
   * @return {GMailApp.GMailLabel} - Gmail label object
   */
  getOrCreateGmailLabel(name) {
    if (!this._gmailLabelsCache[name]) {
      this.logging.info("Getting Gmail label...", name);
      let label;
      label = this.gmail.getUserLabelByName(name);
      if (!label) {
        this.logging.info("Creating Gmail label...", name);
        label = this.gmail.createLabel(name);
      }
      this._gmailLabelsCache[name] = label;
    }
    return this._gmailLabelsCache[name];
  }

  /**
   * Appends labels to a thread in Gmail.
   * @param {object} merchant - Merchant object
   * @param {string[]=} merchant.labels - Array of labels to append
   * @param {GMailApp.GMailThread} thread - Gmail thread object
   */
  appendLabels(merchant, thread) {
    const labels = (merchant.labels && Array.isArray(merchant.labels)) ? merchant.labels : [];
    labels.concat(this.config.getGmailLabel()).forEach((label) => {
      const gmailLabel = this.getOrCreateGmailLabel(label);
      thread.addLabel(gmailLabel);
    });
  };
}

module.exports = Inbox;
