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
        return result.value[new Date(Date.now()).getMonth()] 
    })
}

function hentReferanseVerdi() {
    // Henter månedsverdi fra august 1961 (se spørring i "SSB-query - aug1961.json")
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

        let resultatVerdi = ((nyesteVerdi / refVerdi) * REFERANSE_SPR_VERDI).toFixed(2)
        let hovedtekst = document.getElementById("xkronersspørsmålet")
        let talltekst = document.getElementById("xkroneritall")

        talltekst.textContent = ("(" + String(resultatVerdi) + " kr)").replace(".", ",")
        hovedtekst.textContent = convertNumberWithComma(resultatVerdi) + "kronersspørsmålet"
    })
})