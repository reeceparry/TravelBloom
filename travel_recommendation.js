document.addEventListener('DOMContentLoaded', () => {
  const DATA_URL = 'travel_recommendation_api.json';
  const input = document.getElementById('searchInput');
  const search = document.getElementById('searchBtn');
  const reset = document.getElementById('resetBtn');

  let results = document.getElementById('results');
  if (!results) {
    results = document.createElement('div');
    results.id = 'results';
    document.body.appendChild(results);
  }

  let cities = [];
  let beaches = [];
  let temples = [];

  fetch(DATA_URL)
    .then(r => r.json())
    .then(data => {
      console.log('Fetched travel data:', data);
      cities = (data.countries || [])
        .flatMap(c => (c.cities || []).map(city => ({
          name: city.name,
          imageUrl: city.imageUrl,
          description: city.description
        })));
      beaches = (data.beaches || []).map(b => ({
        name: b.name,
        imageUrl: b.imageUrl,
        description: b.description
      }));
      temples = (data.temples || []).map(t => ({
        name: t.name,
        imageUrl: t.imageUrl,
        description: t.description
      }));
    })
    .catch(err => {
      console.error('Fetch error:', err);
      results.textContent = 'Failed to load recommendations.';
    });

  function render(list, emptyMsg = 'No results.') {
    results.innerHTML = '';
    if (!list || !list.length) {
      results.textContent = emptyMsg;
      return;
    }
    list.forEach(item => {
      const card = document.createElement('div');
      card.style.margin = '10px 0';
      card.style.padding = '10px';
      card.style.background = 'rgba(255,255,255,0.85)';

      const title = document.createElement('h3');
      title.textContent = item.name;
      title.style.margin = '0 0 6px 0';

      const img = document.createElement('img');
      img.src = item.imageUrl || '';
      img.alt = item.name || 'destination';
      img.style.maxWidth = '100%';
      img.style.display = item.imageUrl ? 'block' : 'none';

      const desc = document.createElement('p');
      desc.textContent = item.description || '';
      desc.style.margin = '6px 0 0 0';

      card.appendChild(title);
      card.appendChild(img);
      card.appendChild(desc);
      results.appendChild(card);
    });
  }

  search?.addEventListener('click', () => {
    const q = (input.value || '').trim().toLowerCase();
    if (!q) {
      render([], 'Please enter a keyword.');
      return;
    }

    if (q === 'beach' || q === 'beaches') {
      const picks = beaches.slice(0, 2);
      render(picks, 'No beach recommendations found.');
      return;
    }

    if (q === 'temple' || q === 'temples') {
      const picks = temples.slice(0, 2);
      render(picks, 'No temple recommendations found.');
      return;
    }

    if (q === 'country' || q === 'countries') {
      const picks = cities.slice(0, 2);
      render(picks, 'No country recommendations found.');
      return;
    }

    const pool = [...beaches, ...temples, ...cities];
    const matches = pool.filter(i =>
      (i.name || '').toLowerCase().includes(q) ||
      (i.description || '').toLowerCase().includes(q)
    );
    render(matches.slice(0, 2), 'No matching recommendations found.');
  });

  reset?.addEventListener('click', () => {
    input.value = '';
    results.innerHTML = '';
  });
});
