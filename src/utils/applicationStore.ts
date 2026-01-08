import fs from "fs";
import path from "path";

const DATA_DIR = path.join(__dirname, "../data");
const FILE_PATH = path.join(DATA_DIR, "applications.json");

export function saveApplication(userId: string, application: any) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]");
  }

  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
  data.push({ userId, ...application });

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}
