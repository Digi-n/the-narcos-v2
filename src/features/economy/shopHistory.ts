import fs from "fs";
import path from "path";

const HISTORY_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "shopHistory.json"
);

export interface ShopHistoryEntry {
  buyerId: string;
  items: Record<string, number>;
  total: number;
  timestamp: number;
}

export function loadShopHistory(): ShopHistoryEntry[] {
  if (!fs.existsSync(HISTORY_PATH)) return [];
  return JSON.parse(fs.readFileSync(HISTORY_PATH, "utf-8"));
}

export function saveShopHistory(entry: ShopHistoryEntry) {
  const history = loadShopHistory();
  history.push(entry);
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
}
