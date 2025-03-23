class Config {
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
   * Returns the ID of the BigQuery table to be optionally
   * used to store the data.
   * @return {string}
   */
  getBqTableId() {
    return this.getUserProp('BQ_TABLE_ID', 'expenses');
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
