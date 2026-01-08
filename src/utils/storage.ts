import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data");

function ensureFile(file: string, defaultData: object) {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
  }

  const fullPath = path.join(dataPath, file);

  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify(defaultData, null, 2));
  }

  return fullPath;
}

// BANK
const bankFile = ensureFile("bank.json", { black_balance: 0 });

// STOCK
const stockFile = ensureFile("stock.json", {
  weed: 0,
  meth: 0,
  distribution: 0,
});

// NAME LOCKS
const nameLockFile = ensureFile("nameLocks.json", {});

// EXPORT HELPERS
export function loadBank() {
  return JSON.parse(fs.readFileSync(bankFile, "utf-8"));
}

export function saveBank(data: object) {
  fs.writeFileSync(bankFile, JSON.stringify(data, null, 2));
}

export function loadStock() {
  return JSON.parse(fs.readFileSync(stockFile, "utf-8"));
}

export function saveStock(data: object) {
  fs.writeFileSync(stockFile, JSON.stringify(data, null, 2));
}

export function loadNameLocks() {
  return JSON.parse(fs.readFileSync(nameLockFile, "utf-8"));
}

export function saveNameLocks(data: object) {
  fs.writeFileSync(nameLockFile, JSON.stringify(data, null, 2));
}
