class Database {
  /**
   * Constuctor.
   * @param {BigQuery} bq - BigQuery compatible object
   * @param {Config} config - Config object
   * @param {Logging} logging - Logging object
   */
  constructor(bq, config, logging) {
    this.bq = bq;
    this.config = config;
    this.logging = logging;
  }

  /**
   * Returns the schema of the expenses table.
   * @return {object}
   * @see https://cloud.google.com/bigquery/docs/reference/rest/v2/tables#TableSchema
   */
  getExpensesTableSchema() {
    return {
      fields: [
        {
          name: "id",
          type: "STRING",
          mode: "REQUIRED",
          description: "A unique identifier of the purchase receipt",
        },
        {
          name: "merchant",
          type: "STRING",
          mode: "REQUIRED",
          description: "The unique identifier of the merchant that sold the goods",
        },
        {
          name: "category",
          type: "STRING",
          mode: "REQUIRED",
          description: "The category of the purchased goods",
        },
        {
          name: "amount",
          type: "FLOAT",
          mode: "REQUIRED",
          description: "The amount paid to the merchant",
        },
        {
          name: "currency",
          type: "STRING",
          mode: "REQUIRED",
          defaultValueExpression: "'EUR'",
          description: "ISO 4217 code of the currency used to pay",
        },
        {
          name: "notes",
          type: "STRING",
          mode: "NULLABLE",
          description: "Any additional notes",
        },
        {
          name: "created_at",
          type: "DATETIME",
          mode: "REQUIRED",
          defaultValueExpression: "CURRENT_DATETIME()",
          description: "Inferred date and time of the purchase",
        },
      ],
    };
  }

  /**
   * Creates a new expenses table in the BigQuery dataset.
   */
  createExpensesTable() {
    this.logging.info("Creating expenses table in BigQuery dataset...");
    // Docs at: https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/insert?authuser=0
    this.bq.Tables.insert(
      {
        tableReference: {
          projectId: this.config.getGcpProjectId(),
          datasetId: this.config.getBqDatasetId(),
          tableId: this.config.getBqTableExpensesId(),
        },
        friendlyName: "Expenses",
        description: "Expense tracking",
        timePartitioning: {
          field: "created_at",
          type: "MONTH",
        },
        schema: this.getExpensesTableSchema(),
      },
      this.config.getGcpProjectId(),
      this.config.getBqDatasetId(),
    );
    this.logging.info("Created expenses table in BigQuery dataset");
  }

  /**
   * Creates a new dataset in BigQuery and the expenses table.
   * @return {Bigquery_v2.Bigquery.V2.Schema.Dataset}
   * @see https://cloud.google.com/bigquery/docs/reference/rest/v2/datasets?authuser=0#DatasetReference
   * @see https://cloud.google.com/bigquery/docs/locations?authuser=0
   * @see https://cloud.google.com/bigquery/docs/labels-intro?authuser=0#requirements
   */
  createAndInitBqDataset() {
      this.logging.info("Creating BigQuery dataset...");
      const ds = this.bq.Datasets.insert(
        {
          datasetReference: {
            projectId: this.config.getGcpProjectId(),
            datasetId: this.config.getBqDatasetId(),
          },
          friendlyName: "Accounting",
          description: "Personal accounting dataset",
          location: this.config.getBqDatasetLocation(),
          labels: {
            created_by: "apps_script",
          }
        },
        this.config.getGcpProjectId(),
      );
      this.logging.info("BigQuery dataset created", {etag: ds.etag});

      this.createExpensesTable();

      return ds;
  }

  /**
   * Retrieves the dataset from BigQuery, or returns
   * `undefined` if not found.
   * @return {Bigquery_v2.Bigquery.V2.Schema.Dataset|undefined}
   */
  getBqDataset() {
    try {
      this.logging.info("Retrieving BigQuery dataset...");
      const ds = this.bq.Datasets.get(
        this.config.getGcpProjectId(),
        this.config.getBqDatasetId(),
      );
      this.logging.info("BigQuery dataset retrieved", {etag: ds.etag});
      return ds;
    } catch (error) {
      if (error.message.toLowerCase().includes("not found")) {
        this.logging.info("BigQuery dataset not found");
      } else {
        this.logging.error("Error retrieving BigQuery dataset", error);
        throw error;
      }
    }

    return undefined;
  }

  /**
   * Writes all the parsed expenses to BigQuery.
   * @param {object[]} rows - Array of expense records to be inserted
   */
  insertExpenses(rows) {
    this.bq.Tabledata.insertAll(
      {rows: rows},
      this.config.getGcpProjectId(),
      this.config.getBqDatasetId(),
      this.config.getBqTableExpensesId(),
    );
  }
}

module.exports = Database;
