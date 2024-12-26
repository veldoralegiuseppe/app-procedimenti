const StringUtils = {
    toCamelCase: (str) => {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    },

    fromCamelCase: (str, firstUpper = true) => {
        let result = str.replace(/([A-Z])/g, (g) => ` ${g[0].toLowerCase()}`);
        if (firstUpper) {
            result = result.charAt(0).toUpperCase() + result.slice(1);
        }
        return result;
    }
}

export default StringUtils;