import { useCallback } from 'react';
import { ModelTypes } from '@shared/metadata';
import { TransazioneEnumsV1 } from '@shared/metadata';

const useStatistiche = () => {

    const getTransazioni = (procedimento = {}) => {
        return Object.values(procedimento).map((p) => p?.type === ModelTypes.TRANSIZIONE);
    } 

    const getDistribuzioneEsitoProcedimento = useCallback((procedimenti = []) => {
        const esiti = procedimenti.map((p) => p.esito);

        const distribuzioneEsito = esiti.reduce((acc, e) => {
            acc[e] = (acc[e] || 0) + 1;
            return acc;
        }, {});

        return distribuzioneEsito;
    }, []);

    const getDistribuzioneStatoTransazioni = useCallback((procedimenti = []) => {
        const distribuzione = {};

        procedimenti.forEach((p) => {
            const transazioni = getTransazioni(p);
            transazioni.forEach((t) => {
                distribuzione[t.stato] = (distribuzione[t.stato] || 0) + 1;
            });
        })
       
        return distribuzione;
    }, []);

    const getTransazioniAggregate = useCallback((procedimenti = []) => {
        const {DA_SALDARE, PARZIALMENTE_SALDATO, SALDATO} = TransazioneEnumsV1.stato;
        const transazioniMap = {};

        procedimenti.forEach((p) => {
            const transazioni = getTransazioni(p);
            transazioni.forEach((t) => {
                if (!transazioniMap[t.key]) {
                    transazioniMap[t.key] = t;
                } else {
                    const newImportoDovuto = transazioniMap[t.key].importoDovuto + t.importoDovuto;
                    const newImportoCorrisposto = transazioniMap[t.key].importoCorrisposto + t.newImportoCorrisposto;
                    const newStato = newImportoCorrisposto === newImportoDovuto ? SALDATO : newImportoCorrisposto === 0 ? DA_SALDARE : PARZIALMENTE_SALDATO;

                    transazioniMap[t.key] = {
                        ...transazioniMap[t.key],
                        importoDovuto: newImportoDovuto,
                        importoCorrisposto: newImportoCorrisposto,
                        stato: newStato,
                    };
                }
            });
        });

        return Object.values(transazioniMap);
    }, []);

    const getPieChartData = useCallback((distribuzione = {}) => 
        Object.entries(distribuzione).map(([label, value]) => ({ id: label, value, label }))
    , []);

    return {
        getDistribuzioneEsitoProcedimento,
        getDistribuzioneStatoTransazioni,
        getTransazioniAggregate,
        getPieChartData,
    }
}

export default useStatistiche;