import { convertNumberWithComma, convertNumber } from "./number2text.js"

const TABLE_URL = "https://data.ssb.no/api/v0/no/table/08981"

const REFERANSE_SPR_VERDI = 1_000

function hentNyesteVerdi() {
    // Henter nyeste verdi fra månedsverdi (se spørring i "SSB-query - nyeste.json")
    return fetch(TABLE_URL, {
        method: 'POST',
        body: JSON.stringify({
            "query": [
                { "code": "Maaned", "selection": { "filter": "all", "values": ["*"] } },
                { "code": "Tid", "selection": { "filter": "top", "values": ["1"] } }
            ],
            "response": { "format": "json-stat2" }
        }),
        headers: {
            'Content-Type': 'application/json'
        }

    }).then((response) => response.json()).then((result) => {
        let latestValue = null;
        for (let mnthVal of result.value) {
            if (mnthVal !== null) {
                latestValue = mnthVal
            }
        }
        return latestValue;
    })
}

function hentReferanseVerdi() {
    // Henter månedsverdi fra august 1961 (se spørring i "SSB-query - aug1961.json")
    /* 
    Grunnen til at denne manuelt hentes ut hver gang er delvis i tilfelle referanseverdien for 100
    endrer seg (sist gjort i 2015) og delvis grunnet latskap
    */
    return fetch(TABLE_URL, {
        method: 'POST',
        body: JSON.stringify({
            "query": [
                { "code": "Maaned", "selection": { "filter": "item", "values": ["08"] } },
                { "code": "Tid", "selection": { "filter": "item", "values": ["1961"] } }
            ],
            "response": { "format": "json-stat2" }
        }),
        headers: {
            'Content-Type': 'application/json'
        }

    }).then((response) => response.json()).then((result) => {
        return result.value[0]
    })
}

hentNyesteVerdi().then(nyesteVerdi => {
    hentReferanseVerdi().then(refVerdi => {

        let hovedtekst = document.getElementById("xkronersspørsmålet")
        let talltekst = document.getElementById("xkroneritall")

        if (nyesteVerdi == null) {
            hovedtekst.textContent = "[Klarte ikke å hente indeksdata fra SSB]"
            talltekst.textContent = "Prøv igjen senere..."
            return;
        }

        let resultatVerdi = ((nyesteVerdi / refVerdi) * REFERANSE_SPR_VERDI).toFixed(2)

        talltekst.textContent = ("(" + String(resultatVerdi) + " kr)").replace(".", ",")
        hovedtekst.textContent = convertNumberWithComma(resultatVerdi) + "kronersspørsmålet"
    })
})
