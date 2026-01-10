import fs from "fs";
import path from "path";

const FILE = path.join(__dirname, "../data/stock.json");

export type StockType = "weed" | "meth" | "distribution";

export interface StockData {
  weed: number;
  meth: number;
  distribution: number;
}

export function loadStock(): StockData {
  if (!fs.existsSync(FILE)) {
    const base: StockData = { weed: 0, meth: 0, distribution: 0 };
    fs.writeFileSync(FILE, JSON.stringify(base, null, 2));
    return base;
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

export function updateStock(
  type: StockType,
  amount: number
): StockData {

  const stock = loadStock();

  if (type !== "distribution") {
    // ❌ Prevent negative stock
    if (stock[type] + amount < 0) {
      throw new Error("Insufficient stock");
    }
  }

  stock[type] += amount;

  fs.writeFileSync(FILE, JSON.stringify(stock, null, 2));
  return stock;
}

