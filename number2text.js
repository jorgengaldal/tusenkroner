let sifferNavn = [
    "null",
    "en",
    "to",
    "tre",
    "fire",
    "fem",
    "seks",
    "syv",
    "åtte",
    "ni",
    "ti",
    "elleve",
    "tolv",
    "tretten",
    "fjorten",
    "femten",
    "seksten",
    "sytten",
    "atten",
    "nitten",
];
let tierNavn = [
    null,
    "ti",
    "tjue",
    "tretti",
    "førti",
    "femti",
    "seksti",
    "sytti",
    "åtti",
    "nitti",
];
let storeTallNavn = {
    0: "",
    100: "hundre",
    1000: "tusen",
    1_000_000: "million",
    1_000_000_000: "milliard",
    1_000_000_000_000: "billion",
    1_000_000_000_000_000: "billiard",
}; // TODO: Få inn flere tall her

export function convertNumberWithComma(num) {
    let numberString = new String(num);
    let numberStrings = numberString.split(".");
    let beforeComma = parseInt(numberStrings[0]);
    let afterComma = parseInt(numberStrings[1]);

    return convertNumber(beforeComma) + "komma" + convertNumber(afterComma);
}

export function convertNumber(num) {
    const result = [];

    let thousands = 0;
    while (num != 0) {
        let lastThreeDigits = num % 1000;
        let iterationDigits = convertNumberUnderThousand(lastThreeDigits)
        
        result.splice(0, 0, (thousands == 1 && !result.includes("hundre") ? "og" : "")) // tusenogtjueseks i stedet for tusentjueseks.
        result.splice(0, 0, storeTallNavn[thousands * 1000]) // tusen/million/milliard/osv.
        result.splice(0, 0, (iterationDigits == "en" && thousands == 1 ? "et" : iterationDigits)) // "ett" foran tusen i stedet for "en"

        thousands += 1;
        num = Math.floor(num / 1000);
    }

    return result.join("\xAD");
}

function convertNumberUnderThousand(num) {
    let useOg = false;
    const result = [];
    if (num == 0) {
        return sifferNavn[0];
    }
    if (num >= 200) {
        result.splice(result.length, 0, sifferNavn[Math.trunc(num / 100)])
        result.splice(result.length, 0, storeTallNavn[100])
    } else if (num >= 100) {
        result.splice(result.length, 0, "ett")
        result.splice(result.length, 0, storeTallNavn[100])
    }
    if (num >= 101) {
        useOg = true;
    }
    num = num % 100;
    if (num == 0) {
        return result.join("\xAD");
    }
    if (useOg) {
        result.splice(result.length, 0, "og")
    }
    if (num < 20) {
        result.splice(result.length, 0, sifferNavn[num])
    } else {
        result.splice(result.length, 0, tierNavn[Math.trunc(num / 10)])
        num = num % 10;
        if (num == 0) {
            return result.join("\xAD");
        }
        result.splice(result.length, 0, sifferNavn[num])
    }

    return result.join("\xAD");
}
