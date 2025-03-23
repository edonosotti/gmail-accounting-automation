/* eslint-disable no-undef */
const Parser = require("../../src/lib/parser");

const TEST_STRINGS = [
  "10,00€",
  "10.00€",
  "10,00$",
  "10.00$",
  "€10,00",
  "€10.00",
  "$10,00",
  "$10.00",
  "10,00  €",
  "10.00  €",
  "10,00  $",
  "10.00  $",
  "€  10,00",
  "€  10.00",
  "$  10,00",
  "$  10.00",
  "Total amount due: 10,00€",
  "10,00€ received, thanks!",
  "Total amount of 10,00€ received",
  "10,00€ is the total amount"
];

describe("lib/parser", () => {
  let parser;

  beforeEach(() => {
    parser = new Parser();
  });

  test("getRegexMatchCurrency should return a regex to match currency values", () => {
    const regex = parser.getRegexMatchCurrency();
    expect(regex).toBeInstanceOf(RegExp);
    TEST_STRINGS.forEach((testString) => {
      expect(testString.match(regex)[0].replace(",", ".").includes("10.00")).toBe(true);
    });
  });

  test("getRegexParseAmount should return a regex to parse currency values", () => {
    const regex = parser.getRegexParseAmount();
    expect(regex).toBeInstanceOf(RegExp);
    expect("10,00".match(regex)).toEqual(["10,00"]);
    TEST_STRINGS.forEach((testString) => {
      expect(testString.match(regex)[0].replace(",", ".")).toBe("10.00");
    });
  });

  test("findTotalAmount should return the last currency value in the message body", () => {
    const message = {
      getBody: () => "Item #1:  10,00€\nItem #2:  15,00€\nDiscount:  5,00€\nTotal:  20,00€"
    };
    const totalAmount = parser.findTotalAmount(message, "getBody");
    expect(totalAmount).toBe("20,00€");
  });

  test("findTotalAmount should return undefined if no currency value is found", () => {
    const message = {
      getBody: () => "No currency value here"
    };
    const totalAmount = parser.findTotalAmount(message, "getBody");
    expect(totalAmount).toBeUndefined();
  });

  test("findPurchaseDate should return the date of the message", () => {
    const date = new Date();
    const message = {
      getDate: () => date
    };
    const purchaseDate = parser.findPurchaseDate(message);
    expect(purchaseDate).toBe(date);
  });

  test("sanitizeFloatString should convert currency string to valid float string", () => {
    const sanitizedValue = parser.sanitizeFloatString("10,00€");
    expect(sanitizedValue).toBe("10.00");
  });
});
