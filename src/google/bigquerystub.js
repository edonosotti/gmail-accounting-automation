/**
 * Stub of the BigQuery class to be used in place
 * of the `BigQuery` service in Google Apps Script.
 * Implement this class to run the application
 * in a Node.js environment.
 */

class BigQueryDatasetStub {
  constructor(bq) {
    this.bq = bq;
  }

  insert(dataset, projectId) {
    this.bq.logging.log("Inserting dataset:", dataset, projectId);
    throw new Error("Not implemented");
  }

  get(projectId, datasetId) {
    this.bq.logging.log("Getting dataset:", datasetId, projectId);
    throw new Error("Not implemented");
  }
}

class BigQueryTableStub {
  constructor(bq) {
    this.bq = bq;
  }

  insert(table, projectId, datasetId) {
    this.bq.logging.log("Inserting table:", table, datasetId, projectId);
    throw new Error("Not implemented");
  }
}

class BigQueryTabledataStub {
  constructor(bq) {
    this.bq = bq;
  }

  insertAll(rows, projectId, datasetId, tableId) {
    this.bq.logging.log("Inserting rows:", rows, tableId, datasetId, projectId);
    throw new Error("Not implemented");
  }
}

class BigQueryStub {
  constructor(config, logging) {
    this.config = config;
    this.logging = logging;
    this.Datasets = new BigQueryDatasetStub(this);
    this.Tables = new BigQueryTableStub(this);
    this.Tabledata = new BigQueryTabledataStub(this);
  }
}

module.exports = BigQueryStub;
