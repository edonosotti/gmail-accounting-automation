class Config {
  /**
   * Returns the value of the script property with the given name.
   * If the property does not exist, returns the default value.
   * Script properties are shared across all users of the script.
   * @param {string} name - The name of the script property
   * @param {*} defaultValue - The default value (or `undefined` if not provided)
   * @return {string}
   */
  getScriptProp(name, defaultValue) {
    try {
      // `PropertiesService` only exists in Google Apps Script runtime environment.
      // eslint-disable-next-line no-undef
      return PropertiesService
        .getScriptProperties()
        .getProperty(name) ?? defaultValue;
    } catch (_error) {
      // `process` only exists in the local development environment.
      // eslint-disable-next-line no-undef
      return ((process ?? {}).env ?? {})[`GAS_SCRIPT_${name}`] ?? defaultValue;
    }
  }

  /**
   * Returns the value of the user property with the given name.
   * If the property does not exist, returns the default value.
   * User properties are specific to the current user of the script.
   * @param {string} name - The name of the user property
   * @param {*} defaultValue - The default value (or `undefined` if not provided)
   * @return {string}
   */
  getUserProp(name, defaultValue) {
    try {
      // `PropertiesService` only exists in Google Apps Script runtime environment.
      // eslint-disable-next-line no-undef
      return PropertiesService
        .getUserProperties()
        .getProperty(name) ?? defaultValue;
    } catch (_error) {
      // `process` only exists in the local development environment.
      // eslint-disable-next-line no-undef
      return ((process ?? {}).env ?? {})[`GAS_USER_${name}`] ?? defaultValue;
    }
  }

  /**
   * Returns the value of the document property with the given name.
   * If the property does not exist, returns the default value.
   * Document properties are specific to the current document in
   * which the script is running as an extension of the app.
   * @param {string} name - The name of the document property
   * @param {*} defaultValue - The default value (or `undefined` if not provided)
   * @return {string}
   */
  getDocProp(name, defaultValue) {
    try {
      // `PropertiesService` only exists in Google Apps Script runtime environment.
      // eslint-disable-next-line no-undef
      return PropertiesService
        .getDocumentProperties()
        .getProperty(name) ?? defaultValue;
    } catch (_error) {
      // `process` only exists in the local development environment.
      // eslint-disable-next-line no-undef
      return ((process ?? {}).env ?? {})[`GAS_DOC_${name}`] ?? defaultValue;
    }
  }

  /**
   * Returns the ID of the user's Google Cloud Platform project
   * bound to the script.
   * @return {string}
   */
  getGcpProjectId() {
    return this.getUserProp('GCP_PROJECT_ID');
  }

  /**
   * Returns the ID of the BigQuery dataset to be optionally
   * used to store the data.
   * @return {string}
   */
  getBqDatasetId() {
    return this.getUserProp('BQ_DATASET_ID', 'gmail_accounting');
  }

  /**
   * Returns the location of the BigQuery dataset to be optionally
   * used to store the data.
   * @return {string}
   */
  getBqDatasetLocation() {
    return this.getUserProp('BQ_DATASET_LOCATION');
  }

  /**
   * Returns the ID of the BigQuery expenses table to be optionally
   * used to store the data.
   * @return {string}
   */
  getBqTableExpensesId() {
    return this.getUserProp('BQ_TABLE_EXPENSES_ID', 'expenses');
  }

  /**
   * Returns the label that will be appended to each message
   * that has been processed to filter them out from the
   * next processing.
   * @return {string}
   */
  getGmailLabel() {
    return this.getUserProp('GMAIL_LABEL', 'Expenses');
  }

  /**
   * Returns the maximum number of messages that will be
   * processed in one batch, per each merchant.
   * Returns `1` if the value is not a positive integer.
   * @return {number}
   */
  getProcessingBatchSize() {
    const value = parseInt(this.getUserProp('PROCESSING_BATCH_SIZE', 1000));
    return !isNaN(value) && value > 0 ? value : 1;
  }
}

module.exports = Config;
