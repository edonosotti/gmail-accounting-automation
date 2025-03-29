const Database = require("../../src/lib/database");

/* eslint-disable no-undef */

describe("lib/database", () => {
  let database;
  let mockBq;
  let mockConfig;
  let mockLogging;

  beforeEach(() => {
    mockBq = {
      Tables: {
        insert: jest.fn(),
      },
      Datasets: {
        insert: jest.fn(),
        get: jest.fn(),
      },
      Tabledata: {
        insertAll: jest.fn(),
      },
    };

    mockConfig = {
      getGcpProjectId: jest.fn().mockReturnValue("test-project"),
      getBqDatasetId: jest.fn().mockReturnValue("test-dataset"),
      getBqTableExpensesId: jest.fn().mockReturnValue("test-expenses"),
      getBqDatasetLocation: jest.fn().mockReturnValue("test-region"),
    };

    mockLogging = {
      info: jest.fn(),
      error: jest.fn(),
    };

    database = new Database(mockBq, mockConfig, mockLogging);
  });

  test("getExpensesTableSchema should return the correct schema", () => {
    const schema = database.getExpensesTableSchema();
    expect(schema).toHaveProperty("fields");
    expect(schema.fields).toBeInstanceOf(Array);
    expect(schema.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "id", type: "STRING", mode: "REQUIRED" }),
        expect.objectContaining({ name: "merchant", type: "STRING", mode: "REQUIRED" }),
        expect.objectContaining({ name: "category", type: "STRING", mode: "REQUIRED" }),
        expect.objectContaining({ name: "amount", type: "FLOAT", mode: "REQUIRED" }),
        expect.objectContaining({ name: "currency", type: "STRING", mode: "REQUIRED" }),
        expect.objectContaining({ name: "notes", type: "STRING", mode: "NULLABLE" }),
        expect.objectContaining({ name: "created_at", type: "DATETIME", mode: "REQUIRED" }),
      ])
    );
  });

  test("createExpensesTable should call BigQuery API to create the table", () => {
    database.createExpensesTable();
    expect(mockLogging.info).toHaveBeenCalledWith("Creating expenses table in BigQuery dataset...");
    expect(mockBq.Tables.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        tableReference: expect.objectContaining({
          projectId: "test-project",
          datasetId: "test-dataset",
          tableId: "test-expenses",
        }),
        schema: database.getExpensesTableSchema(),
      }),
      "test-project",
      "test-dataset"
    );
    expect(mockLogging.info).toHaveBeenCalledWith("Created expenses table in BigQuery dataset");
  });

  test("createAndInitBqDataset should create a dataset and initialize the expenses table", () => {
    mockBq.Datasets.insert.mockReturnValue({ etag: "test-etag" });

    const dataset = database.createAndInitBqDataset();

    expect(mockLogging.info).toHaveBeenCalledWith("Creating BigQuery dataset...");
    expect(mockBq.Datasets.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        datasetReference: expect.objectContaining({
          projectId: "test-project",
          datasetId: "test-dataset",
        }),
        location: "test-region",
      }),
      "test-project"
    );
    expect(mockLogging.info).toHaveBeenCalledWith("BigQuery dataset created", { etag: "test-etag" });
    expect(mockLogging.info).toHaveBeenCalledWith("Creating expenses table in BigQuery dataset...");
    expect(mockBq.Tables.insert).toHaveBeenCalled();
    expect(dataset).toEqual({ etag: "test-etag" });
  });

  test("getBqDataset should retrieve the dataset if it exists", () => {
    mockBq.Datasets.get.mockReturnValue({ etag: "test-etag" });

    const dataset = database.getBqDataset();

    expect(mockLogging.info).toHaveBeenCalledWith("Retrieving BigQuery dataset...");
    expect(mockBq.Datasets.get).toHaveBeenCalledWith("test-project", "test-dataset");
    expect(mockLogging.info).toHaveBeenCalledWith("BigQuery dataset retrieved", { etag: "test-etag" });
    expect(dataset).toEqual({ etag: "test-etag" });
  });

  test("getBqDataset should return undefined if the dataset is not found", () => {
    mockBq.Datasets.get.mockImplementation(() => {
      const error = new Error("Not found");
      error.message = "Not found";
      throw error;
    });

    const dataset = database.getBqDataset();

    expect(mockLogging.info).toHaveBeenCalledWith("Retrieving BigQuery dataset...");
    expect(mockLogging.info).toHaveBeenCalledWith("BigQuery dataset not found");
    expect(dataset).toBeUndefined();
  });

  test("getBqDataset should throw an error for other exceptions", () => {
    mockBq.Datasets.get.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    expect(() => database.getBqDataset()).toThrow("Unexpected error");
    expect(mockLogging.error).toHaveBeenCalledWith("Error retrieving BigQuery dataset", expect.any(Error));
  });

  test("insertExpenses should call BigQuery API to insert rows", () => {
    const rows = [{ json: { id: "1", amount: 10.0 } }];

    database.insertExpenses(rows);

    expect(mockBq.Tabledata.insertAll).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: rows,
      }),
      "test-project",
      "test-dataset",
      "test-expenses"
    );
  });
});
