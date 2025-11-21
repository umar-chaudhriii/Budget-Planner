// Country to Currency mapping for all countries
export const COUNTRY_CURRENCY_MAP: { [key: string]: string } = {
    // A
    "Afghanistan": "AFN",
    "Albania": "ALL",
    "Algeria": "DZD",
    "Andorra": "EUR",
    "Angola": "AOA",
    "Argentina": "ARS",
    "Armenia": "AMD",
    "Australia": "AUD",
    "Austria": "EUR",
    "Azerbaijan": "AZN",

    // B
    "Bahamas": "BSD",
    "Bahrain": "BHD",
    "Bangladesh": "BDT",
    "Barbados": "BBD",
    "Belarus": "BYN",
    "Belgium": "EUR",
    "Belize": "BZD",
    "Benin": "XOF",
    "Bhutan": "BTN",
    "Bolivia": "BOB",
    "Bosnia and Herzegovina": "BAM",
    "Botswana": "BWP",
    "Brazil": "BRL",
    "Brunei": "BND",
    "Bulgaria": "BGN",
    "Burkina Faso": "XOF",
    "Burundi": "BIF",

    // C
    "Cambodia": "KHR",
    "Cameroon": "XAF",
    "Canada": "CAD",
    "Cape Verde": "CVE",
    "Central African Republic": "XAF",
    "Chad": "XAF",
    "Chile": "CLP",
    "China": "CNY",
    "Colombia": "COP",
    "Comoros": "KMF",
    "Congo": "XAF",
    "Costa Rica": "CRC",
    "Croatia": "EUR",
    "Cuba": "CUP",
    "Cyprus": "EUR",
    "Czech Republic": "CZK",

    // D
    "Denmark": "DKK",
    "Djibouti": "DJF",
    "Dominican Republic": "DOP",

    // E
    "Ecuador": "USD",
    "Egypt": "EGP",
    "El Salvador": "USD",
    "Equatorial Guinea": "XAF",
    "Eritrea": "ERN",
    "Estonia": "EUR",
    "Eswatini": "SZL",
    "Ethiopia": "ETB",

    // F
    "Fiji": "FJD",
    "Finland": "EUR",
    "France": "EUR",

    // G
    "Gabon": "XAF",
    "Gambia": "GMD",
    "Georgia": "GEL",
    "Germany": "EUR",
    "Ghana": "GHS",
    "Greece": "EUR",
    "Guatemala": "GTQ",
    "Guinea": "GNF",
    "Guinea-Bissau": "XOF",
    "Guyana": "GYD",

    // H
    "Haiti": "HTG",
    "Honduras": "HNL",
    "Hong Kong": "HKD",
    "Hungary": "HUF",

    // I
    "Iceland": "ISK",
    "India": "INR",
    "Indonesia": "IDR",
    "Iran": "IRR",
    "Iraq": "IQD",
    "Ireland": "EUR",
    "Israel": "ILS",
    "Italy": "EUR",

    // J
    "Jamaica": "JMD",
    "Japan": "JPY",
    "Jordan": "JOD",

    // K
    "Kazakhstan": "KZT",
    "Kenya": "KES",
    "Kuwait": "KWD",
    "Kyrgyzstan": "KGS",

    // L
    "Laos": "LAK",
    "Latvia": "EUR",
    "Lebanon": "LBP",
    "Lesotho": "LSL",
    "Liberia": "LRD",
    "Libya": "LYD",
    "Lithuania": "EUR",
    "Luxembourg": "EUR",

    // M
    "Madagascar": "MGA",
    "Malawi": "MWK",
    "Malaysia": "MYR",
    "Maldives": "MVR",
    "Mali": "XOF",
    "Malta": "EUR",
    "Mauritania": "MRU",
    "Mauritius": "MUR",
    "Mexico": "MXN",
    "Moldova": "MDL",
    "Monaco": "EUR",
    "Mongolia": "MNT",
    "Montenegro": "EUR",
    "Morocco": "MAD",
    "Mozambique": "MZN",
    "Myanmar": "MMK",

    // N
    "Namibia": "NAD",
    "Nepal": "NPR",
    "Netherlands": "EUR",
    "New Zealand": "NZD",
    "Nicaragua": "NIO",
    "Niger": "XOF",
    "Nigeria": "NGN",
    "North Korea": "KPW",
    "North Macedonia": "MKD",
    "Norway": "NOK",

    // O
    "Oman": "OMR",

    // P
    "Pakistan": "PKR",
    "Panama": "PAB",
    "Papua New Guinea": "PGK",
    "Paraguay": "PYG",
    "Peru": "PEN",
    "Philippines": "PHP",
    "Poland": "PLN",
    "Portugal": "EUR",

    // Q
    "Qatar": "QAR",

    // R
    "Romania": "RON",
    "Russia": "RUB",
    "Rwanda": "RWF",

    // S
    "Saudi Arabia": "SAR",
    "Senegal": "XOF",
    "Serbia": "RSD",
    "Seychelles": "SCR",
    "Sierra Leone": "SLL",
    "Singapore": "SGD",
    "Slovakia": "EUR",
    "Slovenia": "EUR",
    "Somalia": "SOS",
    "South Africa": "ZAR",
    "South Korea": "KRW",
    "South Sudan": "SSP",
    "Spain": "EUR",
    "Sri Lanka": "LKR",
    "Sudan": "SDG",
    "Suriname": "SRD",
    "Sweden": "SEK",
    "Switzerland": "CHF",
    "Syria": "SYP",

    // T
    "Taiwan": "TWD",
    "Tajikistan": "TJS",
    "Tanzania": "TZS",
    "Thailand": "THB",
    "Togo": "XOF",
    "Trinidad and Tobago": "TTD",
    "Tunisia": "TND",
    "Turkey": "TRY",
    "Turkmenistan": "TMT",

    // U
    "Uganda": "UGX",
    "Ukraine": "UAH",
    "United Arab Emirates": "AED",
    "United Kingdom": "GBP",
    "United States": "USD",
    "Uruguay": "UYU",
    "Uzbekistan": "UZS",

    // V
    "Venezuela": "VES",
    "Vietnam": "VND",

    // Y
    "Yemen": "YER",

    // Z
    "Zambia": "ZMW",
    "Zimbabwe": "ZWL"
};

// Comprehensive currency list with symbols
export const CURRENCIES = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "SEK", symbol: "kr", name: "Swedish Krona" },
    { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
    { code: "MXN", symbol: "$", name: "Mexican Peso" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
    { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
    { code: "KRW", symbol: "₩", name: "South Korean Won" },
    { code: "TRY", symbol: "₺", name: "Turkish Lira" },
    { code: "RUB", symbol: "₽", name: "Russian Ruble" },
    { code: "BRL", symbol: "R$", name: "Brazilian Real" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
    { code: "DKK", symbol: "kr", name: "Danish Krone" },
    { code: "PLN", symbol: "zł", name: "Polish Zloty" },
    { code: "THB", symbol: "฿", name: "Thai Baht" },
    { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
    { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
    { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
    { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
    { code: "CLP", symbol: "$", name: "Chilean Peso" },
    { code: "PHP", symbol: "₱", name: "Philippine Peso" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    { code: "COP", symbol: "$", name: "Colombian Peso" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
    { code: "RON", symbol: "lei", name: "Romanian Leu" },
    { code: "ARS", symbol: "$", name: "Argentine Peso" },
    { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
    { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
    { code: "EGP", symbol: "£", name: "Egyptian Pound" },
    { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
    { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
    { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
    { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
    { code: "QAR", symbol: "﷼", name: "Qatari Riyal" },
    { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
    { code: "OMR", symbol: "﷼", name: "Omani Rial" },
    { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
    { code: "JOD", symbol: "د.ا", name: "Jordanian Dinar" },
    { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" },
    { code: "NPR", symbol: "Rs", name: "Nepalese Rupee" },
    { code: "TWD", symbol: "NT$", name: "Taiwan Dollar" }
];

// Get all countries sorted alphabetically
export const COUNTRIES = Object.keys(COUNTRY_CURRENCY_MAP).sort();

// Get currency for a country
export function getCurrencyForCountry(country: string): string {
    return COUNTRY_CURRENCY_MAP[country] || "USD";
}

// Get currency details
export function getCurrencyDetails(code: string) {
    return CURRENCIES.find(c => c.code === code) || { code, symbol: code, name: code };
}
