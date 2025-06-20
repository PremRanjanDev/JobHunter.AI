import fs from 'fs';
import path from 'path';

export class JsonFile {
    constructor(filePath) {
        this.filePath = filePath;
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    append(jsonRecord) {
        let data = [];
        if (fs.existsSync(this.filePath)) {
            try {
                const fileContent = fs.readFileSync(this.filePath, 'utf-8');
                data = JSON.parse(fileContent);
                if (!Array.isArray(data)) {
                    data = [data];
                }
            } catch (e) {
                data = [];
            }
        }
        data.push(jsonRecord);
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
}

export function saveJsonRecord(filePath, jsonRecord) {
    new JsonFile(filePath).append(jsonRecord);
}
