/* eslint-disable no-undef */

const DependencyContainer = require("../../src/lib/dependencycontainer");

describe("lib/dependencycontainer", () => {
  let container;

  beforeEach(() => {
    container = new DependencyContainer();
  });

  test("should register and retrieve a dependency", () => {
    const dependency = { foo: "bar" };
    container.register("myDependency", dependency);
    const retrievedDependency = container.get("myDependency");
    expect(retrievedDependency).toBe(dependency);
  });

  test("should return undefined for non-existent dependency", () => {
    const retrievedDependency = container.get("nonExistentDependency");
    expect(retrievedDependency).toBeUndefined();
  });

  test("should overwrite existing dependency with the same name", () => {
    const dependency1 = { foo: "bar1" };
    const dependency2 = { foo: "bar2" };
    container.register("myDependency", dependency1);
    container.register("myDependency", dependency2);
    const retrievedDependency = container.get("myDependency");
    expect(retrievedDependency).toBe(dependency2);
  });

  test("should handle multiple dependencies", () => {
    const dependency1 = { foo: "bar1" };
    const dependency2 = { foo: "bar2" };
    container.register("dependency1", dependency1);
    container.register("dependency2", dependency2);
    expect(container.get("dependency1")).toBe(dependency1);
    expect(container.get("dependency2")).toBe(dependency2);
  });
});
