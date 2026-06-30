const TYPES = [
  "普通",
  "草",
  "火",
  "水",
  "光",
  "地",
  "冰",
  "龙",
  "电",
  "毒",
  "虫",
  "武",
  "翼",
  "萌",
  "幽",
  "恶",
  "机械",
  "幻",
];

const DEFENSE_CHART = {
  "普通": { weak: ["武"], resist: ["幽"] },
  "草": { weak: ["火", "冰", "毒", "虫", "翼"], resist: ["水", "地", "电", "光"] },
  "火": { weak: ["水", "地"], resist: ["草", "冰", "虫", "萌", "机械"] },
  "水": { weak: ["草", "电"], resist: ["火", "机械"] },
  "光": { weak: ["草", "幽"], resist: ["恶", "幻"] },
  "地": { weak: ["草", "水", "冰", "武", "机械"], resist: ["普通", "火", "电", "毒", "翼"] },
  "冰": { weak: ["火", "地", "武", "机械"], resist: ["水", "冰", "光"] },
  "龙": { weak: ["冰", "龙", "萌"], resist: ["草", "火", "水", "电", "翼"] },
  "电": { weak: ["地"], resist: ["电", "翼", "机械"] },
  "毒": { weak: ["地", "恶", "幻"], resist: ["草", "毒", "虫", "武", "萌"] },
  "虫": { weak: ["火", "翼"], resist: ["草", "武"] },
  "武": { weak: ["翼", "萌", "幻"], resist: ["地", "虫", "恶"] },
  "翼": { weak: ["冰", "电"], resist: ["草", "虫", "武"] },
  "萌": { weak: ["毒", "恶", "机械"], resist: ["虫", "武"] },
  "幽": { weak: ["光", "幽", "恶"], resist: ["普通", "毒", "虫", "武"] },
  "恶": { weak: ["光", "虫", "武", "萌"], resist: ["幽", "恶"] },
  "机械": { weak: ["火", "水", "武"], resist: ["普通", "草", "冰", "龙", "毒", "虫", "翼", "萌", "机械", "幻"] },
  "幻": { weak: ["虫", "幽"], resist: ["武", "幻"] },
};

const matrixHead = document.querySelector("#matrixHead");
const matrixBody = document.querySelector("#matrixBody");

function init() {
  const team = readTeam();
  renderHead();
  renderBody(team);
}

function renderHead() {
  const row = document.createElement("tr");
  const petHead = document.createElement("th");
  petHead.textContent = "宠物";
  row.append(petHead);

  for (const type of TYPES) {
    const th = document.createElement("th");
    th.textContent = type;
    row.append(th);
  }

  matrixHead.append(row);
}

function renderBody(team) {
  if (team.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = TYPES.length + 1;
    cell.className = "empty-lineup";
    cell.textContent = "还没有阵容，请先返回配队页面选择六只宠物。";
    row.append(cell);
    matrixBody.append(row);
    return;
  }

  for (const pet of team) {
    const row = document.createElement("tr");
    const petCell = document.createElement("td");
    petCell.className = "matrix-pet";

    const image = document.createElement("img");
    image.src = pet.image;
    image.alt = pet.name;
    image.loading = "lazy";

    const text = document.createElement("span");
    text.textContent = pet.name;

    const typeList = document.createElement("small");
    typeList.textContent = pet.types.join(" / ");

    petCell.append(image, text, typeList);
    row.append(petCell);

    for (const attackType of TYPES) {
      const result = getDefenseResult(pet.types, attackType);
      const cell = document.createElement("td");
      cell.className = "matrix-mark " + result.className;
      cell.title = pet.name + " 受到 " + attackType + " 属性攻击：" + result.label;
      cell.textContent = result.mark;
      row.append(cell);
    }

    matrixBody.append(row);
  }
}

function getDefenseResult(petTypes, attackType) {
  let score = 0;
  for (const petType of petTypes) {
    const rule = DEFENSE_CHART[petType];
    if (!rule) continue;
    if (rule.weak.includes(attackType)) score += 1;
    if (rule.resist.includes(attackType)) score -= 1;
  }

  if (score >= 2) return { mark: "××", className: "weak double", label: "双重被克制" };
  if (score === 1) return { mark: "×", className: "weak", label: "被克制" };
  if (score === -1) return { mark: "✓", className: "resist", label: "抵抗" };
  if (score <= -2) return { mark: "✓✓", className: "resist double", label: "双重抵抗" };
  return { mark: "○", className: "neutral", label: "普通" };
}

function readTeam() {
  try {
    const team = JSON.parse(sessionStorage.getItem("rocoTeam") || "[]");
    return Array.isArray(team) ? team.slice(0, 6) : [];
  } catch {
    return [];
  }
}

init();
