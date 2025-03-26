/* eslint-disable no-undef */
const log = jest.spyOn(console, "log").mockImplementation(() => {});
const info = jest.spyOn(console, "info").mockImplementation(() => {});
const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
const error = jest.spyOn(console, "error").mockImplementation(() => {});
const debug = jest.spyOn(console, "debug").mockImplementation(() => {});

const Logging = require("../../src/lib/logging");

describe("lib/logging", () => {
  beforeEach(() => {
    log.mockClear();
    info.mockClear();
    warn.mockClear();
    error.mockClear();
    debug.mockClear();
  });

  it("should log to console", () => {
    const logging = new Logging({ getUserProp: () => false });
    logging.log("log");
    logging.info("info");
    logging.warn("warn");
    logging.error("error");
    logging.debug("debug");

    expect(log).toBeCalledWith("log");
    expect(info).toBeCalledWith("info");
    expect(warn).toBeCalledWith("warn");
    expect(error).toBeCalledWith("error");
    expect(debug).toBeCalledWith("debug");
  });

  it("should log to cloud", () => {
    const logging = new Logging({ getUserProp: () => true });
    logging.log("log");
    logging.info("info");
    logging.warn("warn");
    logging.error("error");
    logging.debug("debug");

    expect(log).toBeCalledWith("log");
    expect(log).toBeCalledWith("info");
    expect(log).toBeCalledWith("warn");
    expect(log).toBeCalledWith("error");
    expect(log).toBeCalledWith("debug");
  });
});
