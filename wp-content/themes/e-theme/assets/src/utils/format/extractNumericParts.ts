/**
 * Extracts numeric parts from a stat string like "+60 %" or "–40 %"
 * Handles spaces and unicode minus/plus characters
 */

export interface NumericParts {
  /** The prefix including any sign symbols (+, –, etc.) */
  prefix: string;
  /** The numeric magnitude as a positive number */
  magnitude: number;
  /** The suffix including any symbols like % or x */
  suffix: string;
  /** The aria-label for screen readers */
  ariaLabel: string;
}

/**
 * Parses stat strings like "+60 %" or "–40 %" into components
 * @param statString - The string to parse (e.g., "+60 %", "–40 %", "9x")
 * @returns Object with prefix, magnitude, suffix, and ariaLabel
 */
export const extractNumericParts = (statString: string): NumericParts => {
  // Handle unicode minus (U+2013) and regular minus, plus unicode plus and regular plus
  const unicodeMinusRegex = /[\u2013\u2212-]/;
  const unicodePlusRegex = /[\u002B\uFF0B]/;
  
  // Trim the string first
  const trimmed = statString.trim();
  
  // Extract prefix (signs)
  let prefix = '';
  let remaining = trimmed;
  
  // Check for sign at the beginning
  if (unicodeMinusRegex.test(trimmed[0])) {
    prefix = trimmed[0];
    remaining = trimmed.slice(1);
  } else if (unicodePlusRegex.test(trimmed[0])) {
    prefix = trimmed[0];
    remaining = trimmed.slice(1);
  }
  
  // Remove any spaces after the sign
  remaining = remaining.trim();
  
  // Extract the numeric part
  const numericMatch = remaining.match(/^([\d.]+)/);
  if (!numericMatch) {
    // Fallback for unexpected formats
    return {
      prefix: '',
      magnitude: 0,
      suffix: trimmed,
      ariaLabel: trimmed
    };
  }
  
  const numericString = numericMatch[1];
  const magnitude = parseFloat(numericString);
  
  // Extract suffix (everything after the number)
  let suffix = remaining.slice(numericString.length).trim();
  
  // Ensure there's a space before % if it exists and there's no space
  if (suffix === '%' && !suffix.startsWith(' ')) {
    suffix = ' ' + suffix;
  }
  
  // Create aria-label by combining all parts without extra spaces
  const ariaLabel = `${prefix}${numericString}${suffix}`.replace(/\s+/g, ' ').trim();
  
  return {
    prefix,
    magnitude: isNaN(magnitude) ? 0 : magnitude,
    suffix,
    ariaLabel
  };
};