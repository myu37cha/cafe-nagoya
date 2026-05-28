// ===== サンプルカフェデータ =====
const cafes = [
  {
    id: 1,
    name: "Café Mignon",
    station: "栄駅",
    hours: "10:00 〜 19:00",
    closed: "火曜日",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
    desc: "栄の路地裏にひっそりと佇む、フレンチスタイルのカフェ。自家製ケーキとこだわりのコーヒーが人気です。落ち着いた雰囲気でゆっくり過ごせます。"
  },
  {
    id: 2,
    name: "パン工房 Soleil",
    station: "金山駅",
    hours: "8:00 〜 18:00",
    closed: "月曜日・火曜日",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
    desc: "毎朝焼きたてのパンが並ぶ、金山の人気ベーカリーカフェ。イートインスペースでモーニングを楽しめます。"
  },
  {
    id: 3,
    name: "Le Petit Four",
    station: "覚王山駅",
    hours: "11:00 〜 20:00",
    closed: "水曜日",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    desc: "覚王山の閑静なエリアにある、パティスリー併設のカフェ。季節のタルトやマカロンが絶品です。"
  },
  {
    id: 4,
    name: "Boulangerie Hana",
    station: "今池駅",
    hours: "9:00 〜 17:00",
    closed: "日曜日・月曜日",
    image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&q=80",
    desc: "今池の住宅街に溶け込む小さなブーランジェリー。天然酵母のパンとオーガニックコーヒーが自慢です。"
  },
  {
    id: 5,
    name: "喫茶 ことり",
    station: "大須観音駅",
    hours: "10:00 〜 18:00",
    closed: "木曜日",
    image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80",
    desc: "大須の下町情緒あふれる純喫茶。昔ながらのナポリタンとプリンが名物。レトロな内装が心地よいです。"
  },
  {
    id: 6,
    name: "Café Rosette",
    station: "名古屋駅",
    hours: "8:00 〜 21:00",
    closed: "不定休",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
    desc: "名古屋駅直結の便利なカフェ。ラテアートが美しく、テイクアウトも充実。朝から夜まで幅広く利用できます。"
  }
];

// ===== お気に入り管理 =====
function getFavorites() {
  return JSON.parse(localStorage.getItem('nagoya-cafe-favs') || '[]');
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem('nagoya-cafe-favs', JSON.stringify(favs));
  updateFavBtn(id, favs.includes(id));
}

function updateFavBtn(id, isFav) {
  const btn = document.querySelector(`.fav-btn[data-id="${id}"]`);
  if (!btn) return;
  btn.textContent = isFav ? '❤️' : '🤍';
  btn.classList.toggle('active', isFav);
  btn.setAttribute('aria-label', isFav ? 'お気に入りを解除' : 'お気に入りに追加');
}

// ===== 行った管理 =====
function getVisited() {
  return JSON.parse(localStorage.getItem('nagoya-cafe-visited') || '[]');
}

function toggleVisited(id) {
  let visited = getVisited();
  if (visited.includes(id)) {
    visited = visited.filter(v => v !== id);
  } else {
    visited.push(id);
  }
  localStorage.setItem('nagoya-cafe-visited', JSON.stringify(visited));
  updateVisitedBtn(id, visited.includes(id));
  // 「行った」「行ってない」タブ表示中なら再レンダリング
  if (currentMode === 'visited') showVisited();
  if (currentMode === 'notvisited') showNotVisited();
}

function updateVisitedBtn(id, isVisited) {
  const btn = document.querySelector(`.visited-btn[data-id="${id}"]`);
  if (!btn) return;
  btn.textContent = isVisited ? '✅' : '🗺️';
  btn.setAttribute('aria-label', isVisited ? '行ったを解除' : '行ったに登録');
}

// ===== 並び替え =====
function getSortedCafes(list, sortKey) {
  const sorted = [...list];
  if (sortKey === 'newest') {
    sorted.sort((a, b) => b.id - a.id); // id降順＝新しい順
  } else if (sortKey === 'oldest') {
    sorted.sort((a, b) => a.id - b.id); // id昇順＝古い順
  } else if (sortKey === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  } else if (sortKey === 'station') {
    sorted.sort((a, b) => a.station.localeCompare(b.station, 'ja'));
  }
  return sorted;
}

// ===== カードを生成 =====
function createCard(cafe) {
  const favs = getFavorites();
  const isFav = favs.includes(cafe.id);
  const visited = getVisited();
  const isVisited = visited.includes(cafe.id);

  const card = document.createElement('article');
  card.className = 'cafe-card';
  card.innerHTML = `
    <a href="cafe.html?id=${cafe.id}" class="card-link" aria-label="${cafe.name}の詳細を見る">
      <img class="cafe-img" src="${cafe.image}" alt="${cafe.name}の写真" loading="lazy" />
    </a>
    <button
      class="fav-btn ${isFav ? 'active' : ''}"
      data-id="${cafe.id}"
      aria-label="${isFav ? 'お気に入りを解除' : 'お気に入りに追加'}"
      onclick="handleFavClick(event, ${cafe.id})"
    >${isFav ? '❤️' : '🤍'}</button>
    <a href="cafe.html?id=${cafe.id}" class="card-link-body">
      <div class="cafe-body">
        <h2 class="cafe-name">
          <button
            class="visited-btn ${isVisited ? 'active' : ''}"
            data-id="${cafe.id}"
            aria-label="${isVisited ? '行ったを解除' : '行ったに登録'}"
            onclick="event.preventDefault(); toggleVisited(${cafe.id})"
          >${isVisited ? '✅' : '🗺️'}</button>${cafe.name}
        </h2>
        <ul class="cafe-info">
          <li><span class="label">最寄り駅</span>${cafe.station}</li>
          <li><span class="label">営業時間</span>${cafe.hours}</li>
          <li><span class="label">定休日</span>${cafe.closed}</li>
        </ul>
      </div>
    </a>
  `;
  return card;
}

// ハートボタンはリンクの中に入らないよう独立して処理
function handleFavClick(event, id) {
  event.stopPropagation();
  toggleFavorite(id);
  if (typeof currentMode !== 'undefined' && currentMode === 'fav') {
    showFavorites();
  }
}

// ===== 表示切り替え（一覧ページ用） =====
let currentMode = 'all';
let currentSort = 'newest';

const allBtns = () => ['btn-all', 'btn-fav', 'btn-visited', 'btn-notvisited']
  .map(id => document.getElementById(id)).filter(Boolean);

function setActiveTab(activeId) {
  allBtns().forEach(btn => btn.classList.remove('active'));
  const active = document.getElementById(activeId);
  if (active) active.classList.add('active');
}

function setEmptyMsg(icon, text) {
  const el = document.getElementById('empty-fav');
  if (!el) return;
  document.getElementById('empty-icon').textContent = icon;
  document.getElementById('empty-text').textContent = text;
}

function showAll() {
  currentMode = 'all';
  setActiveTab('btn-all');
  renderCafes(cafes);
}

function showFavorites() {
  currentMode = 'fav';
  setActiveTab('btn-fav');
  setEmptyMsg('🍰', 'お気に入りのカフェをハートで登録しよう！');
  const favs = getFavorites();
  renderCafes(cafes.filter(c => favs.includes(c.id)));
}

function showVisited() {
  currentMode = 'visited';
  setActiveTab('btn-visited');
  setEmptyMsg('✅', '行ったカフェを「行った」ボタンで記録しよう！');
  const visited = getVisited();
  renderCafes(cafes.filter(c => visited.includes(c.id)));
}

function showNotVisited() {
  currentMode = 'notvisited';
  setActiveTab('btn-notvisited');
  setEmptyMsg('🎉', 'すべてのカフェに行きましたね！すごい！');
  const visited = getVisited();
  renderCafes(cafes.filter(c => !visited.includes(c.id)));
}

function onSortChange() {
  currentSort = document.getElementById('sort-select').value;
  if (currentMode === 'fav') showFavorites();
  else if (currentMode === 'visited') showVisited();
  else if (currentMode === 'notvisited') showNotVisited();
  else showAll();
}

function renderCafes(list) {
  const grid = document.getElementById('cafe-grid');
  const emptyMsg = document.getElementById('empty-fav');
  if (!grid) return;
  grid.innerHTML = '';

  const sorted = getSortedCafes(list, currentSort);

  if (sorted.length === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
    sorted.forEach(cafe => grid.appendChild(createCard(cafe)));
  }
}

// ===== 初期表示（一覧ページのみ） =====
if (document.getElementById('cafe-grid')) {
  renderCafes(cafes);
}
