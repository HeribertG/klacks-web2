

export function commercialRound(result: number): number {

    const sub1 = result.toFixed(2);
    const res = (+result * 100).toFixed(0);
    const firstDigit = res.substring(res.length - 1, res.length);

    if (+firstDigit < 5) {
        result = Math.round(result * 20) / 20;
    } else if (+firstDigit > 5) {

        result = Math.floor(result * 20) / 20;
    }


    return result;
}

export function calcVatFromInclusiveValue(total: number, vat: number): number {
    return total / (100 + +vat) * 100;
}

export function calcVatFromExclusiveValue(total: number, vat: number): number {
    const sub = total * (vat / 100);
    return Math.round(sub * 100) / 100;
}
