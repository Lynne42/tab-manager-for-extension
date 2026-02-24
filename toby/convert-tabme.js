import fs from "fs";
import { randomUUID } from "crypto";

const inputPath = "./tabme_backup.json"; // 改成你的 Toby 导出文件名
const outputPath = "./tabme-converted-final.json";

const toby = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

const result = {
  version: 1,
  spaces: []
};

const space = result.spaces;


for (const list of toby.spaces || []) {
  const spacenow = {
    id: randomUUID(),
    name: list.title || "",
    groups: []
  };

  for (const group of list.folders || []) {
    const groupnow = {
      id: randomUUID(),
      name: group.title || "",
      tabs: []
    }
    group.items.forEach(card => {
      groupnow.tabs.push({
        id: randomUUID(),
        title: card.customTitle || card.title || "",
        description: card.customDescription || "",
        url: card.url || "",
        favIconUrl: card.faviconUrl || ""
      });
    });
    spacenow.groups.push(groupnow);
  }

  space.push(spacenow);

}

console.log(result);

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");

console.log("✅ 转换完成:", outputPath);

