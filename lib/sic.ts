// lib/sic.ts — Standard Industrial Classification (SIC) code → industry name
//
// SIC codes are the SEC's industry taxonomy assigned to every public filer.
// Source: https://www.sec.gov/info/edgar/siccodes (canonical SEC titles).
//
// We expose two helpers:
//   - sicCodeToName(code) → human-readable industry name (or "Industry [code]"
//     fallback for unmapped codes)
//   - SIC_CATALOG → array of {code, name} for every SIC in our corpus, used
//     for /industry/ index page generation
//
// Strategy: map every SIC code that appears in our current data plus a few
// commonly-seen-in-EDGAR codes that aren't yet in our cache. Unknown codes
// degrade gracefully (page still renders; just shows "Industry NNNN" header).

export interface SicInfo {
  code: string;
  name: string;
}

// Curated mapping — all 44 codes present in the current corpus + common
// adjacent codes. Names mirror the SEC's canonical SIC catalog spelling.
const SIC_NAMES: Record<string, string> = {
  // Mining + extraction
  "1000": "Metal Mining",
  "1040": "Gold Mining",
  "1090": "Miscellaneous Metal Ores",
  "1311": "Crude Petroleum & Natural Gas",
  "1381": "Drilling Oil & Gas Wells",
  "1400": "Mining & Quarrying of Nonmetallic Minerals",
  // Construction
  "1540": "General Building Contractors — Nonresidential",
  // Food + beverage
  "2000": "Food & Kindred Products",
  "2080": "Beverages",
  // Apparel
  "2300": "Apparel & Other Finished Products",
  // Chemicals
  "2800": "Industrial & Miscellaneous Chemicals",
  "2833": "Medicinal Chemicals & Botanical Products",
  "2834": "Pharmaceutical Preparations",
  "2836": "Biological Products",
  // Metals
  "3312": "Steel Works, Blast Furnaces & Rolling Mills",
  "3357": "Drawing & Insulating of Nonferrous Wire",
  // Electronics + computer hardware
  "3577": "Computer Peripheral Equipment",
  "3674": "Semiconductors & Related Devices",
  "3690": "Miscellaneous Electrical Machinery & Supplies",
  // Vehicles
  "3711": "Motor Vehicles & Passenger Car Bodies",
  // Instruments
  "3826": "Laboratory Analytical Instruments",
  "3841": "Surgical & Medical Instruments",
  "3851": "Ophthalmic Goods",
  // Transportation
  "4400": "Water Transportation",
  // Communications
  "4812": "Radiotelephone Communications",
  "4813": "Telephone Communications",
  "4832": "Radio Broadcasting Stations",
  "4833": "Television Broadcasting Stations",
  // Utilities
  "4911": "Electric Services",
  // Wholesale
  "5040": "Wholesale — Professional & Commercial Equipment",
  "5140": "Wholesale — Groceries & Related Products",
  "5190": "Wholesale — Miscellaneous Nondurable Goods",
  // Retail
  "5900": "Retail Stores",
  // Banking + finance
  "6021": "National Commercial Banks",
  "6022": "State Commercial Banks",
  "6029": "Commercial Banks",
  "6199": "Finance Services",
  "6200": "Security & Commodity Brokers, Dealers, Exchanges",
  "6211": "Security Brokers, Dealers & Flotation Companies",
  "6500": "Real Estate",
  "6798": "Real Estate Investment Trusts",
  // Services
  "7370": "Services — Computer Services",
  "7372": "Services — Prepackaged Software",
  "7373": "Services — Computer Integrated Systems Design",
  "7374": "Services — Computer Processing & Data Preparation",
  "7389": "Services — Business Services",
  "7990": "Services — Amusement & Recreation",
  // Health
  "8011": "Services — Offices & Clinics of Doctors of Medicine",
};

export function sicCodeToName(code: string): string {
  return SIC_NAMES[code] ?? `Industry ${code}`;
}

export function isKnownSic(code: string): boolean {
  return code in SIC_NAMES;
}
