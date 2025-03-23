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
}

module.exports = Config;
