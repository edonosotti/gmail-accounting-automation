/* eslint-disable no-undef */
/**
 * This file contains the main entry point of the application
 * for Google Apps Script.
 * It does not work in any other environment.
 * The `eslint-disable no-undef` rule is required to ignore
 * validation errors due to Google Apps Script automated
 * loading of all objects into the global scope.
 */

/**
 * Returns an instance of the dependency container
 * with all dependencies registered.
 * @return {DependencyContainer}
 */
const getDependencies = () => {
  const diContainer = new DependencyContainer();
  const config = new Config();
  const logging = new Logging(config);
  diContainer.register('config', config);
  diContainer.register('logging',logging);
  diContainer.register('database', new Database(BigQuery, config, logging));
  diContainer.register('inbox', new Inbox(GMailApp, config, logging));
  return diContainer;
}

/**
 * Main entry point of the application
 * for Google Apps Script.
 */
const main = () => {
  const diContainer = getDependencies();
  const logging = diContainer.get('logging');
  logging.log('Hey, world!');
};

module.exports = main;
