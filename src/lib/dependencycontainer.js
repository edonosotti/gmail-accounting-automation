/**
 * A simple dependency container that allows registering
 * and retrieving dependencies.
 */
class DependencyContainer {
  /**
   * Constructor.
   */
  constructor() {
    this._dependencies = new Map();
  }

  /**
   * Registers a dependency.
   * @param {string} name - The name of the dependency
   * @param {*} dependency - The instance of the dependency
   */
  register(name, dependency) {
    this._dependencies.set(name, dependency);
  }

  /**
   * Retrieves a dependency by name.
   * Returns `undefined` if the dependency is not found.
   * @param {string} name - The name of the dependency
   * @return {*}
   */
  get(name) {
    return this._dependencies.get(name);
  }
}

module.exports = DependencyContainer;
