// CPF → xxx.xxx.xxx-xx
export function maskCPF(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// RG → 00.000.000-0
export function maskRG(value: string) {
    const digits = value
        .replace(/[^\dXx]/g, "")
        .toUpperCase()
        .slice(0, 9);
    return digits
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})([\dX])$/, "$1-$2");
}

// Date → dd/mm/yyyy
export function maskDate(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d)/, "$1/$2");
}

// Phone → (xx) xxxxx-xxxx || (xx) xxxx-xxxx
export function maskPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
        return digits
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
}

// CEP → xxxxx-xxx
export function maskCEP(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

// Names → capitalize first letter of each word, except for common conjunctions/prepositions
const exceptions = ["da", "de", "do", "das", "dos", "e"];

export function capitalizeName(value: string) {
    return value
        .toLowerCase()
        .split(" ")
        .map((word, index) => {
            if (exceptions.includes(word) && index !== 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

// Format -> money value 0.000,00
export function maskBRL(value: number | string) {

    const number = typeof value === "string"
        ? Number(value.replace(/\D/g, "")) / 100
        : value;

    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Money: 1.000,00
export function maskTableCurrency(value: number | string | null | undefined) {
    if (value === null || value === undefined || value === "") return "";
    const number = typeof value === "string"
        ? Number(value.replace(/\./g, "").replace(",", "."))
        : value;
    if (Number.isNaN(number)) return "";
    return number.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// Date: mm-dd-yyyy -> dd/mm/yyyy
export function maskTableDate(value: string | null | undefined) {
    if (!value) return "";

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) return value;

    return `${day}/${month}/${year}`;
}
