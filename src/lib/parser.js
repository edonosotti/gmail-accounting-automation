/**
 * This class contains helper functions to parse
 * the body of e-mail messages and extract relevant
 * information such as the total amount of a purchase
 * receipt and the purchase date.
 */
class Parser {
  /**
   * Returns a regular expression to find any currency
   * values in the body of a message.
   * @return {RegExp}
   */
  getRegexMatchCurrency() {
    return new RegExp(/(\d{1,}(,|\.)\d{1,2}( *?)(€|\$))|(€|\$)( *?)(\d{1,}(,|\.)\d{1,2})/, "g");
  }

  /**
   * Returns a regular expression to parse currency
   * values to a valid float value.
   * @return {RegExp}
   */
  getRegexParseAmount() {
    return new RegExp(/(\d+(\.|,)\d+)/, "g");
  }

  /**
   * Simple helper function to parse the total amount
   * from a purchase receipt. It assumes that the
   * last currency value in the receipt body is the
   * total amount, net of any discounts applied or
   * wallet credit deducted from the amount due.
   * Example of a receipt body:
   * ```
   * Item #1:  10,00€
   * Item #2:  15,00€
   * Discount:  5,00€
   * Total:  20,00€
   * ```
   * In this case, the total amount is 20,00€.
   * @param {GMailMessage} message - Gmail message object
   * @param {Function} bodyHandler - Function to retrieve the body of the message
   * @return {string | undefined}
   */
  findTotalAmount(message, bodyHandler) {
    const body = message[bodyHandler]();
    const items = body.match(this.getRegexMatchCurrency());

    if (items && items.length > 0) {
      return items.reverse()[0];
    }

    return undefined;
  }

  /**
   * Simple helper function to parse the purchase date.
   * It assumes the date of the receipt sent via e-mail
   * is the purchase date.
   * @param {GMailMessage} message - Gmail message object
   * @return {Date}
   */
  findPurchaseDate(message) {
    return message.getDate();
  }

  /**
   * Sanitizes currency values retrieved from
   * the body of the messages to valid float values.
   * @param {string} value - Currency value
   * @return {string}
   */
  sanitizeFloatString(value) {
    return `${value}`
      .match(this.getRegexParseAmount())[0]
      .replace(",", ".");
  }
}

module.exports = Parser;
