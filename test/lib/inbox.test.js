const Inbox = require("../../src/lib/inbox");

/* eslint-disable no-undef */

describe("lib/inbox", () => {
  let inbox;
  let mockGmail;
  let mockConfig;
  let mockLogging;

  beforeEach(() => {
    mockGmail = {
      search: jest.fn(),
      getUserLabelByName: jest.fn(),
      createLabel: jest.fn(),
    };
    mockConfig = {
      getGmailLabel: jest.fn(),
      getProcessingBatchSize: jest.fn(),
    };
    mockLogging = {
      info: jest.fn(),
    };
    inbox = new Inbox(mockGmail, mockConfig, mockLogging);
  });

  describe("searchThreads", () => {
    it("should search for threads using the correct query", () => {
      const merchant = { query: "from:example@example.com" };
      mockConfig.getGmailLabel.mockReturnValue("processed");
      mockConfig.getProcessingBatchSize.mockReturnValue(10);

      inbox.searchThreads(merchant);

      expect(mockGmail.search).toHaveBeenCalledWith(
        "from:example@example.com AND NOT label:processed",
        0,
        10
      );
    });
  });

  describe("getOrCreateGmailLabel", () => {
    it("should return cached label if it exists", () => {
      const labelName = "test-label";
      const mockLabel = { name: labelName };
      inbox._gmailLabelsCache[labelName] = mockLabel;

      const result = inbox.getOrCreateGmailLabel(labelName);

      expect(result).toBe(mockLabel);
      expect(mockGmail.getUserLabelByName).not.toHaveBeenCalled();
      expect(mockGmail.createLabel).not.toHaveBeenCalled();
    });

    it("should retrieve label if not cached", () => {
      const labelName = "test-label";
      const mockLabel = { name: labelName };
      mockGmail.getUserLabelByName.mockReturnValue(mockLabel);

      const result = inbox.getOrCreateGmailLabel(labelName);

      expect(result).toBe(mockLabel);
      expect(mockGmail.getUserLabelByName).toHaveBeenCalledWith(labelName);
      expect(mockGmail.createLabel).not.toHaveBeenCalled();
    });

    it("should create label if it does not exist", () => {
      const labelName = "test-label";
      const mockLabel = { name: labelName };
      mockGmail.getUserLabelByName.mockReturnValue(null);
      mockGmail.createLabel.mockReturnValue(mockLabel);

      const result = inbox.getOrCreateGmailLabel(labelName);

      expect(result).toBe(mockLabel);
      expect(mockGmail.getUserLabelByName).toHaveBeenCalledWith(labelName);
      expect(mockGmail.createLabel).toHaveBeenCalledWith(labelName);
    });
  });

  describe("appendLabels", () => {
    it("should append labels to a thread", () => {
      const merchant = { labels: ["label1", "label2"] };
      const thread = { addLabel: jest.fn() };
      const mockLabel1 = { name: "label1" };
      const mockLabel2 = { name: "label2" };
      const mockConfigLabel = { name: "config-label" };

      mockConfig.getGmailLabel.mockReturnValue("config-label");
      inbox.getOrCreateGmailLabel = jest
        .fn()
        .mockImplementation((label) => {
          if (label === "label1") return mockLabel1;
          if (label === "label2") return mockLabel2;
          if (label === "config-label") return mockConfigLabel;
        });

      inbox.appendLabels(merchant, thread);

      expect(thread.addLabel).toHaveBeenCalledWith(mockLabel1);
      expect(thread.addLabel).toHaveBeenCalledWith(mockLabel2);
      expect(thread.addLabel).toHaveBeenCalledWith(mockConfigLabel);
    });

    it("should handle empty or undefined merchant labels", () => {
      const merchant = {};
      const thread = { addLabel: jest.fn() };
      const mockConfigLabel = { name: "config-label" };

      mockConfig.getGmailLabel.mockReturnValue("config-label");
      inbox.getOrCreateGmailLabel = jest.fn().mockReturnValue(mockConfigLabel);

      inbox.appendLabels(merchant, thread);

      expect(thread.addLabel).toHaveBeenCalledWith(mockConfigLabel);
    });
  });
});
