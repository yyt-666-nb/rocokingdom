const TEAM_LIMIT = 6;

const state = {
  pets: [],
  team: [],
};

const petGrid = document.querySelector("#petGrid");
const teamList = document.querySelector("#teamList");
const teamCount = document.querySelector("#teamCount");
const petTotal = document.querySelector("#petTotal");
const clearTeam = document.querySelector("#clearTeam");
const viewLineup = document.querySelector("#viewLineup");
const petSearch = document.querySelector("#petSearch");

function init() {
  state.pets = window.ROCO_PETS || [];
  state.team = readSavedTeam();
  clearTeam.addEventListener("click", () => {
    state.team = [];
    saveTeam();
    render();
  });
  viewLineup.addEventListener("click", () => {
    saveTeam();
    window.location.href = "./lineup.html";
  });
  petSearch.addEventListener("input", renderPets);
  render();
}

function render() {
  renderTeam();
  renderPets();
}

function renderTeam() {
  teamList.innerHTML = "";
  teamCount.textContent = state.team.length + "/" + TEAM_LIMIT;
  viewLineup.hidden = state.team.length !== TEAM_LIMIT;

  for (let index = 0; index < TEAM_LIMIT; index += 1) {
    const pet = state.team[index];
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "team-slot" + (pet ? " filled" : "");

    if (pet) {
      slot.title = "点击取消 " + pet.name;
      const image = document.createElement("img");
      image.src = pet.image;
      image.alt = pet.name;
      image.loading = "lazy";
      const name = document.createElement("span");
      name.textContent = pet.name;
      slot.append(image, name);
      slot.addEventListener("click", () => togglePet(pet));
    } else {
      slot.textContent = "空位 " + (index + 1);
    }

    teamList.append(slot);
  }
}

function renderPets() {
  petGrid.innerHTML = "";
  const query = petSearch.value.trim().toLowerCase();
  const pets = state.pets.filter((pet) => matchesSearch(pet, query));
  petTotal.textContent = pets.length + "/" + state.pets.length + " 只";

  if (pets.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-search";
    empty.textContent = "没有找到匹配的宠物";
    petGrid.append(empty);
    return;
  }

  for (const pet of pets) {
    const selected = isSelected(pet);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "pet-card" + (selected ? " selected" : "");
    card.title = selected ? "点击取消 " + pet.name : "点击加入 " + pet.name;

    const imageWrap = document.createElement("span");
    imageWrap.className = "pet-image";
    const image = document.createElement("img");
    image.src = pet.image;
    image.alt = pet.name;
    image.loading = "lazy";
    imageWrap.append(image);

    const name = document.createElement("span");
    name.className = "pet-name";
    name.textContent = pet.name;

    const typeList = document.createElement("span");
    typeList.className = "type-list";
    for (const type of pet.types) {
      const chip = document.createElement("span");
      chip.className = "type-chip";
      chip.textContent = type;
      typeList.append(chip);
    }

    card.append(imageWrap, name, typeList);
    card.addEventListener("click", () => togglePet(pet));
    petGrid.append(card);
  }
}

function togglePet(pet) {
  const index = state.team.findIndex((item) => item.name === pet.name);
  if (index >= 0) {
    state.team.splice(index, 1);
    saveTeam();
    render();
    return;
  }

  if (state.team.length >= TEAM_LIMIT) return;
  state.team.push(pet);
  saveTeam();
  render();
}

function isSelected(pet) {
  return state.team.some((item) => item.name === pet.name);
}

function matchesSearch(pet, query) {
  if (!query) return true;
  const text = [pet.name, ...pet.types].join(" ").toLowerCase();
  return text.includes(query);
}

function saveTeam() {
  sessionStorage.setItem("rocoTeam", JSON.stringify(state.team));
}

function readSavedTeam() {
  try {
    const team = JSON.parse(sessionStorage.getItem("rocoTeam") || "[]");
    return Array.isArray(team) ? team.slice(0, TEAM_LIMIT) : [];
  } catch {
    return [];
  }
}

init();
