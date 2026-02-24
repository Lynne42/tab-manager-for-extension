import fs from "fs";
import { randomUUID } from "crypto";

const inputPath = "./toby-export.json"; // 改成你的 Toby 导出文件名
const outputPath = "./toby-converted-final.json";

const toby = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

const result = {
  version: 1,
  spaces: [
    {
      name: "default",
      description: "",
      groups: []
    }
  ]
};

const space = result.spaces[0];

for (const list of toby.lists || []) {
  const group = {
    id: randomUUID(),
    name: list.title || "",
    tabs: []
  };

  for (const card of list.cards || []) {
    group.tabs.push({
      id: randomUUID(),
      title: card.customTitle || card.title || "",
      description: card.customDescription || "",
      url: card.url || ""
    });
  }

  space.groups.push(group);
}

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");

console.log("✅ 转换完成:", outputPath);

