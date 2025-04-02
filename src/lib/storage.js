/**
 * Storage class for managing files and folders in Google Drive.
 * @see https://developers.google.com/apps-script/reference/drive/drive-app
 */
class Storage {
  /**
   * Constructor.
   * @param {DriveApp} drive - DriveApp compatible object
   * @param {Config} config - Config object
   * @param {Logging} logging - Logging object
   */
  constructor(drive, logging) {
    this.drive = drive;
    this.logging = logging;
  }

  /**
   * Finds a subfolder by name within a parent folder.
   * @param {DriveApp.Folder} parentFolder - Parent folder
   * @param {string} subName - Subfolder name
   * @return {DriveApp.Folder} - Subfolder object
   */
  getSubFolder(parentFolder, subName) {
    const subFolders = parentFolder.getFoldersByName(subName);

    if (!subFolders.hasNext()) {
      throw new Error(`Folder not found: ${subName}`);
    }

    return subFolders.next();
  }

  /**
   * Finds the leaf folder containing a file by its path.
   * @param {string} path - File path in the format "folder1/folder2/file.ext"
   * @return {DriveApp.Folder} - Folder object containing the file
   */
  getFolderForFile(path) {
    const levels = path.split("/");
    if (levels.length > 1) {
      let folder = this.drive.getRootFolder();
      for (let i = 0; i < levels.length; i++) {
        const subFolder = this.getSubFolder(folder, levels[i]);
        if (i == (levels.length - 2)) {
          return subFolder;
        } else {
          folder = subFolder;
          continue;
        }
      }
    } else {
      return this.drive.getRootFolder();
    }
  }

  /**
   * Creates a folder recursively based on the provided path.
   * Does not overwrite existing folders, does not throw errors
   * for existing folders.
   * @param {string} path - Folder path in the format "folder1/folder2"
   * @return {DriveApp.Folder} - Created or existing folder object
   */
  createFolderRecursively(path) {
    const levels = path.split("/");
    if (levels.length < 1) {
      throw new Error("Invalid path");
    }

    let folder = this.drive.getRootFolder();
    for (let i = 0; i < levels.length; i++) {
      const subFolders = folder.getFoldersByName(levels[i]);
      folder = (subFolders.hasNext()) ?
        subFolders.next() : folder.createFolder(levels[i]);
      continue;
    }

    return folder;
  }

  /**
   * Finds a file by its path.
   * @param {string} path - File path in the format "folder1/folder2/file.ext"
   * @return {DriveApp.File} - File object
   */
  getFile(path) {
    const levels = path.split("/");
    const folder = this.getFolderForFile(path);
    const files = folder.getFilesByName(levels[levels.length - 1]);

    if (!files.hasNext()) {
      throw new Error(`File not found: ${path}`);
    }

    while (files.hasNext()) {
      const file = files.next();
      return file;
    }
  }

  /**
   * Returns a unique, temporary file name in the root folder.
   * @return {string} - Temporary file name
   */
  getTempFileName() {
    for (let i = 0; i < 100; i++) {
      const randomName = `__tmp_${Date.now()}_${Math.round(Math.random() * 1000)}`;
      if (!this.drive.getRootFolder().getFilesByName(randomName).hasNext()) {
        this.logging.debug("Random file name", randomName);
        return randomName;
      }
    }

    throw new Error("Could not generate a temp file name");
  }

  /**
   * Verifies if a file exists in the specified path.
   * @param {string} path - File path in the format "folder1/folder2/file.ext"
   * @return {boolean} - True if the file exists, false otherwise
   */
  fileExists(path) {
    const levels = path.split("/");
    return this.getFolderForFile(path)
      .getFilesByName(levels[levels.length - 1])
      .hasNext();
  }

  /**
   * Moves a file from one path to another.
   * @param {string} fromPath - Source file path
   * @param {string} toPath - Destination file path
   * @return {DriveApp.File} - Moved file object
   */
  moveFile(fromPath, toPath) {
    const levels = toPath.split("/");
    const source = this.getFile(fromPath);
    const destFolder = this.getFolderForFile(toPath);
    return source.moveTo(destFolder).setName(levels[levels.length - 1]);
  }

  createFile(path, content) {
    const tmpName = this.getTempFileName();
    this.drive.getRootFolder().createFile(tmpName, content);
    return this.moveFile(tmpName, path);
  }
}

module.exports = Storage;
