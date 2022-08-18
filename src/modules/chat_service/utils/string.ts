/**
 * Format string with given params
 * Example:
 * - original: 'It\'s me, {name}!'
 * - params: { name: 'Mario' }
 * - output: 'It\'s me, Mario!'
 * @param original Original string
 * @param params Parameters as key-value object
 * @returns Formatted string
 */
const formatString = (original: string, params: { [key: string]: any }): string => {
  let formatted = original;
  Object.entries(params).forEach(
    ([key, value]) => {
      const expression = new RegExp(`\\{${key}\\}`, 'gi');
      formatted = formatted.replace(expression, value.toString());
    },
  );
  return formatted;
};

export default formatString;
