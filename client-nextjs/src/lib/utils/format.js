/**
 * Utility functions for formatting data
 */

/**
 * Format currency with Korean Won symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: KRW)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = "KRW") {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "₩0";
  }

  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousands separator
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }

  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format date in Korean format
 * @param {string|Date} date - The date to format
 * @param {string} format - Format type ('short', 'long', 'dateOnly', 'timeOnly')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = "short") {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const options = {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
    dateOnly: {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
    timeOnly: {
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return new Intl.DateTimeFormat("ko-KR", options[format] || options.short).format(dateObj);
}

/**
 * Format percentage
 * @param {number} value - The value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }

  return new Intl.NumberFormat("ko-KR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format file size in human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format phone number in Korean format
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return "";

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 11) {
    // Mobile number: 010-1234-5678
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 10) {
    // Local number: 02-1234-5678 or 031-123-4567
    if (cleaned.startsWith("02")) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    } else {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
  }

  return phone;
}

/**
 * Format business registration number
 * @param {string} brn - Business registration number
 * @returns {string} Formatted BRN
 */
export function formatBusinessNumber(brn) {
  if (!brn) return "";

  const cleaned = brn.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
  }

  return brn;
}

/**
 * Parse currency string to number
 * @param {string} currencyStr - Currency string to parse
 * @returns {number} Parsed number
 */
export function parseCurrency(currencyStr) {
  if (!currencyStr) return 0;

  // Remove currency symbols and formatting
  const cleaned = currencyStr.replace(/[₩,\s]/g, "");
  const num = parseFloat(cleaned);

  return isNaN(num) ? 0 : num;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export function truncateText(text, length, suffix = "...") {
  if (!text || text.length <= length) return text || "";

  return text.substring(0, length) + suffix;
}

/**
 * Format decimal as percentage for display
 * @param {number} decimal - Decimal value (0.05 for 5%)
 * @returns {string} Formatted percentage
 */
export function decimalToPercentage(decimal) {
  if (decimal === null || decimal === undefined || isNaN(decimal)) {
    return "0%";
  }

  return (decimal * 100).toFixed(1) + "%";
}
