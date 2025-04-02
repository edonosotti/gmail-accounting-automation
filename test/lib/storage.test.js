const Storage = require("../../src/lib/storage");

/* eslint-disable no-undef */

class MockIterator {
  constructor(items) {
    this.items = items;
    this.index = 0;
  }

  hasNext() {
    return this.index < this.items.length;
  }

  next() {
    return this.items[this.index++];
  }
}

class MockFile {
  constructor(name, content) {
    this.id = `file-${Date.now()}-${Math.random()}`;
    this.name = name ?? "file.txt";
    this.content = content ?? "content";
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  moveTo() {
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }
}

class MockFolder {
  constructor(name, files, subFolders) {
    this.id = `dir-${Date.now()}-${Math.random()}`;
    this.name = name ?? "dir";
    this.files = files ?? [];
    this.subFolders = subFolders ?? [];
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getFoldersByName(name) {
    return new MockIterator(
      this.subFolders.filter((folder) => folder.name === name),
    );
  }

  getFilesByName(name) {
    return new MockIterator(
      this.files.filter((file) => file.name === name),
    );
  }

  createFile(name, content) {
    const file = new MockFile(name, content);
    this.files.push(file);
    return file;
  }

  createFolder(name) {
    const folder = new MockFolder(name);
    this.subFolders.push(folder);
    return folder;
  }
}

class MockDrive extends MockFolder {
  constructor(files, subFolders) {
    super("root", files, subFolders);
  }

  getRootFolder() {
    return this;
  }
}

describe("lib/storage", () => {
  let storage;
  let mockFiles;
  let mockSubfolder1;
  let mockSubfolder2;
  let mockDrive;
  let mockLogging;

  beforeEach(() => {
    mockFiles = [
      new MockFile("file1.txt", "content1"),
      new MockFile("file2.txt", "content2"),
    ];
    mockSubfolder2 = new MockFolder("subFolder2", mockFiles);
    mockSubfolder1 = new MockFolder("subFolder1", mockFiles, [
      mockSubfolder2,
    ])
    mockDrive = new MockDrive(mockFiles, [
      mockSubfolder1,
    ]);
    mockLogging = {
      debug: jest.fn(),
    };
    storage = new Storage(mockDrive, mockLogging);
  });

  describe("getSubFolder", () => {
    it("should return the subfolder if it exists", () => {
      const result = storage.getSubFolder(mockSubfolder1, "subFolder2");
      expect(result).toBe(mockSubfolder2);
    });

    it("should throw an error if the subfolder does not exist", () => {
      expect(() => storage.getSubFolder(mockSubfolder1, "wrongSubFolder")).toThrow(
        "Folder not found: wrongSubFolder"
      );
    });
  });

  describe("getFolderForFile", () => {
    it("should return the folder containing the file", () => {
      const result = storage.getFolderForFile("subFolder1/subFolder2/file1.txt");
      expect(result).toBe(mockSubfolder2);
    });
  });

  describe("createFolderRecursively", () => {
    it("should create folders recursively", () => {
      const result = storage.createFolderRecursively("subFolder3/subFolder4");
      expect(result.name).toBe("subFolder4");
    });

    it("should return existing folders if they already exist", () => {
      const result = storage.createFolderRecursively("subFolder1/subFolder2");
      expect(result.name).toBe("subFolder2");
    });
  });

  describe("getFile", () => {
    it("should return the file if it exists", () => {
      const result = storage.getFile("subFolder1/subFolder2/file1.txt");
      expect(result).toBe(mockFiles[0]);
    });

    it("should throw an error if the file does not exist", () => {
      expect(() => storage.getFile("subFolder1/subFolder2/file3.txt")).toThrow(
        "File not found: subFolder1/subFolder2/file3.txt"
      );
    });
  });

  describe("getTempFileName", () => {
    it("should return a unique temporary file name", () => {
      const tempFileName = storage.getTempFileName();
      expect(tempFileName).toMatch(/^__tmp_\d+_\d+$/);
    });
  });

  describe("fileExists", () => {
    it("should return true if the file exists", () => {
      const result = storage.fileExists("subFolder1/subFolder2/file1.txt");
      expect(result).toBe(true);
    });

    it("should return false if the file does not exist", () => {
      const result = storage.fileExists("subFolder1/subFolder2/file3.txt");
      expect(result).toBe(false);
    });
  });

  describe("moveFile", () => {
    it("should move the file to the specified path", () => {
      const result = storage.moveFile("subFolder1/subFolder2/file1.txt", "subFolder1/subFolder2/file3.txt");
      expect(result.name).toBe("file3.txt");
    });
  });

  describe("createFile", () => {
    it("should create a file and move it to the specified path", () => {
      const result = storage.createFile("subFolder1/subFolder2/file3.txt", "content3");
      expect(result.name).toBe("file3.txt");
    });
  });
});
