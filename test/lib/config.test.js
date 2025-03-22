const TEST_SCRIPT_PROP_NAME = `MY_SCRIPT_PROP_${Date.now()}`;
const TEST_USER_PROP_NAME = `MY_USER_PROP_${Date.now()}`;
const TEST_DOC_PROP_NAME = `MY_DOC_PROP_${Date.now()}`;

const TEST_SCRIPT_PROP_VALUE = `VAL_${Math.random() * 1000}`;
const TEST_USER_PROP_VALUE = `VAL_${Math.random() * 1000}`;
const TEST_DOC_PROP_VALUE = `VAL_${Math.random() * 1000}`;

process.env[`GAS_SCRIPT_${TEST_SCRIPT_PROP_NAME}`] = TEST_SCRIPT_PROP_VALUE;
process.env[`GAS_USER_${TEST_USER_PROP_NAME}`] = TEST_USER_PROP_VALUE;
process.env[`GAS_DOC_${TEST_DOC_PROP_NAME}`] = TEST_DOC_PROP_VALUE;

const Config = require('../../src/lib/config');
describe('lib/config', () => {
  let config;

  beforeEach(() => {
    config = new Config();
  });

  describe('getScriptProp', () => {
    it('should return the script property if it exists', () => {
      const value = config.getScriptProp(TEST_SCRIPT_PROP_NAME, 'defaultValue');
      expect(value).toBe(TEST_SCRIPT_PROP_VALUE);
    });

    it('should return the default value if the script property does not exist', () => {
      const value = config.getScriptProp(`_NONEXISTENT_${TEST_SCRIPT_PROP_NAME}`, 'defaultValue');
      expect(value).toBe('defaultValue');
    });
  });

  describe('getUserProp', () => {
    it('should return the user property if it exists', () => {
      const value = config.getUserProp(TEST_USER_PROP_NAME, 'defaultValue');
      expect(value).toBe(TEST_USER_PROP_VALUE);
    });

    it('should return the default value if the user property does not exist', () => {
      const value = config.getUserProp(`_NONEXISTENT_${TEST_USER_PROP_NAME}`, 'defaultValue');
      expect(value).toBe('defaultValue');
    });
  });

  describe('getDocProp', () => {
    it('should return the document property if it exists', () => {
      const value = config.getDocProp(TEST_DOC_PROP_NAME, 'defaultValue');
      expect(value).toBe(TEST_DOC_PROP_VALUE);
    });

    it('should return the default value if the document property does not exist', () => {
      const value = config.getDocProp(`_NONEXISTENT_${TEST_DOC_PROP_NAME}`, 'defaultValue');
      expect(value).toBe('defaultValue');
    });
  });
});
