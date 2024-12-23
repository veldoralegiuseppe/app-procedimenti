const toCamelCase = (str) => {
  return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
};

const fromCamelCase = (str, capitalizeFirst = true) => {
    let result = str.replace(/([A-Z])/g, ' $1').toLowerCase();
    if (capitalizeFirst) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
};

export { toCamelCase, fromCamelCase };

