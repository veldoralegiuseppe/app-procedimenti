const ImportoUtils = {
    formattaImporto: function(importo) {
        if(importo === undefined || importo === null) return undefined;
        return '€ ' + importo.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

export default ImportoUtils;