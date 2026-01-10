import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data");

// Paths
const cardsFile = path.join(dataPath, "cards.json");
const inventoryFile = path.join(dataPath, "inventory.json");
const economyFile = path.join(dataPath, "economy.json");

// Types
export interface Card {
    id: string;
    name: string;
    rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";
    element: string;
    stats: { atk: number; def: number; hp: number; spd: number };
    image: string;
    description: string;
}

export interface UserInventory {
    [userId: string]: {
        cards: string[]; // List of Card IDs
    };
}

export interface UserEconomy {
    [userId: string]: {
        coins: number;
        gems: number;
        lastDaily: number;
    };
}

// Helpers
function loadData(file: string, defaultData: any) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function saveData(file: string, data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// --- Cards ---
export function getAllCards(): Card[] {
    return loadData(cardsFile, []);
}

export function getCard(cardId: string): Card | undefined {
    const cards = getAllCards();
    return cards.find((c) => c.id === cardId);
}

// --- Inventory ---
export function getUserInventory(userId: string): string[] {
    const data: UserInventory = loadData(inventoryFile, {});
    return data[userId]?.cards || [];
}

export function addCardToInventory(userId: string, cardId: string) {
    const data: UserInventory = loadData(inventoryFile, {});
    if (!data[userId]) data[userId] = { cards: [] };

    data[userId].cards.push(cardId);
    saveData(inventoryFile, data);
}

// --- Economy ---
export function getUserEconomy(userId: string) {
    const data: UserEconomy = loadData(economyFile, {});
    if (!data[userId]) {
        data[userId] = { coins: 1000, gems: 0, lastDaily: 0 }; // Start with 1000 coins
        saveData(economyFile, data);
    }
    return data[userId];
}

export function updateUserEconomy(userId: string, updates: Partial<{ coins: number; gems: number; lastDaily: number }>) {
    const data: UserEconomy = loadData(economyFile, {});
    if (!data[userId]) data[userId] = { coins: 1000, gems: 0, lastDaily: 0 };

    if (updates.coins !== undefined) data[userId].coins = updates.coins;
    if (updates.gems !== undefined) data[userId].gems = updates.gems;
    if (updates.lastDaily !== undefined) data[userId].lastDaily = updates.lastDaily;

    saveData(economyFile, data);
}

export function addCoins(userId: string, amount: number) {
    const eco = getUserEconomy(userId);
    updateUserEconomy(userId, { coins: eco.coins + amount });
}

export function removeCoins(userId: string, amount: number): boolean {
    const eco = getUserEconomy(userId);
    if (eco.coins < amount) return false;
    updateUserEconomy(userId, { coins: eco.coins - amount });
    return true;
}
