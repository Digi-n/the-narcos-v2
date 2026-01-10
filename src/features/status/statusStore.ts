import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data");
const systemFile = path.join(dataPath, "system.json");

export interface SystemData {
    statusChannelId?: string;
    statusMessageId?: string;
}

function loadData(): SystemData {
    if (!fs.existsSync(systemFile)) {
        fs.writeFileSync(systemFile, "{}");
        return {};
    }
    return JSON.parse(fs.readFileSync(systemFile, "utf-8"));
}

function saveData(data: SystemData) {
    fs.writeFileSync(systemFile, JSON.stringify(data, null, 2));
}

export function getStatusPanelInfo() {
    return loadData();
}

export function saveStatusPanelInfo(channelId: string, messageId: string) {
    saveData({
        statusChannelId: channelId,
        statusMessageId: messageId
    });
}
