class Config {
  getScriptProp(name, defaultValue) {
    try {
      return PropertiesService
        .getScriptProperties()
        .getProperty(name) ?? defaultValue;
    } catch (_error) {
      return ((process ?? {}).env ?? {})[`GAS_SCRIPT_${name}`] ?? defaultValue;
    }
  }

  getUserProp(name, defaultValue) {
    try {
      return PropertiesService
        .getUserProperties()
        .getProperty(name) ?? defaultValue;
    } catch (_error) {
      return ((process ?? {}).env ?? {})[`GAS_USER_${name}`] ?? defaultValue;
    }
  }

  getDocProp(name, defaultValue) {
    try {
      return PropertiesService
        .getDocumentProperties()
        .getProperty(name) ?? defaultValue;
    } catch (_error) {
      return ((process ?? {}).env ?? {})[`GAS_DOC_${name}`] ?? defaultValue;
    }
  }
}

module.exports = Config;
