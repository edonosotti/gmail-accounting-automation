[![codebeat badge](https://codebeat.co/badges/fc76b44a-c759-428d-bd8e-77d7c1d72061)](https://codebeat.co/projects/github-com-edonosotti-gmail-accounting-automation-main)
[![CodeFactor](https://www.codefactor.io/repository/github/edonosotti/gmail-accounting-automation/badge)](https://www.codefactor.io/repository/github/edonosotti/gmail-accounting-automation)

# Gmail automated accounting with Apps Script

_WORK IN PROGRESS_

## Description

This project is a simple example of how to automate accounting with Gmail,
BigQuery and Apps Script. It automatically searches e-mails containing
invoices and purchase receipts, based on search criteria set by the user
per each merchant that needs to be tracked. The data is then extracted,
categorized and saved to a spreadsheet in Google Sheets or a BigQuery table.

### What is Apps Script?

Google Apps Script is a JavaScript cloud scripting language that provides
easy ways to automate tasks across Google products and third party services
and build web applications **for free**.

Resources to get started with Apps Script:
- [Introductory article](https://medium.com/rockedscience/automate-your-e-mail-calendar-docs-forms-presentations-and-more-with-google-apps-script-b8f8aceebab1?sk=af6b205dc82b4c4723f765ad11f6a47d)
- [Official website](https://developers.google.com/apps-script)

## Usage

### Configuration

#### Apps Script

When running in Apps Script, this application uses the
[Properties Service](https://developers.google.com/apps-script/guides/properties)
to store configuration data.

#### Local environment

When running locally, the application uses environment variables to store
configuration data in place of the Properties Service.
Since Properties Service separates Script, User and Document properties
in different scopes, the following prefixes must be prepended to the names
of the environment variables to recreate the same behavior:

| PROPERTY SCOPE |    PREFIX     |             EXAMPLE             |
| -------------- | ------------- | ------------------------------- |
| Script         | `GAS_SCRIPT_` | `GAS_SCRIPT_MY_SCRIPT_PROP=...` |
| User           | `GAS_USER_`   | `GAS_USER_MY_USER_PROP=...`     |
| Document       | `GAS_DOC_`    | `GAS_DOC_MY_DOC_PROP=...`       |

## Legal

### License

This project is licensed under the MIT License, see the
[LICENSE](LICENSE) file for details.

### Warranty and disclaimer

As stated in the MIT License attached to this project, this code is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied.
**USE AT YOUR OWN RISK**.
