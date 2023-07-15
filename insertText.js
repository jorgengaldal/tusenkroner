import { convertNumberWithComma, convertNumber } from "./number2text.js"

let hovedtekst = document.getElementById("xkronersspørsmålet")

hovedtekst.textContent = convertNumberWithComma(153_411.76) + "kronersspørsmålet"
