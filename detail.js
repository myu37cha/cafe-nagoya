// ===== 詳細ページの描画 =====
(function () {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const cafe = cafes.find(c => c.id === id);
  const container = document.getElementById('detail-container');

  if (!cafe) {
    container.innerHTML = `
      <div class="empty-msg">
        <span>🍰</span>
        <p>カフェが見つかりませんでした。</p>
        <a href="index.html" class="nav-btn" style="display:inline-block;margin-top:16px;">← 一覧に戻る</a>
      </div>`;
    return;
  }

  // タイトルを更新
  document.title = `${cafe.name} | 名古屋カフェまとめ`;

  const favs = getFavorites();
  const isFav = favs.includes(cafe.id);

  container.innerHTML = `
    <div class="detail-card">
      <div class="detail-img-wrap">
        <img class="detail-img" src="${cafe.image}" alt="${cafe.name}の写真" />
        <button
          class="fav-btn detail-fav ${isFav ? 'active' : ''}"
          data-id="${cafe.id}"
          aria-label="${isFav ? 'お気に入りを解除' : 'お気に入りに追加'}"
          onclick="detailToggleFav(${cafe.id})"
        >${isFav ? '❤️' : '🤍'}</button>
      </div>
      <div class="detail-body">
        <h2 class="detail-name">☕ ${cafe.name}</h2>
        <p class="detail-desc">${cafe.desc}</p>
        <ul class="detail-info">
          <li>
            <span class="label">最寄り駅</span>
            <span>${cafe.station}</span>
          </li>
          <li>
            <span class="label">営業時間</span>
            <span>${cafe.hours}</span>
          </li>
          <li>
            <span class="label">定休日</span>
            <span>${cafe.closed}</span>
          </li>
        </ul>
      </div>
    </div>
  `;
})();

function detailToggleFav(id) {
  toggleFavorite(id);
  const favs = getFavorites();
  const isFav = favs.includes(id);
  const btn = document.querySelector(`.fav-btn[data-id="${id}"]`);
  if (btn) {
    btn.textContent = isFav ? '❤️' : '🤍';
    btn.classList.toggle('active', isFav);
  }
}
