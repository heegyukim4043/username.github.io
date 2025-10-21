
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function setActiveNav(){
    const page = document.querySelector('main')?.dataset.page;
    if(!page) return;
    const map = {home:'index.html', publications:'publications.html', projects:'projects.html', people:'people.html', news:'news.html'};
    $$('.nav .right a').forEach(a => {
      const href = a.getAttribute('href');
      if(href && href.endsWith(map[page])) a.classList.add('active-link');
    });
  }

  async function loadSiteMeta(){
    try {
      const res = await fetch('data/site.json');
      const site = await res.json();
      const brandEls = $$('.brand, .brand-name');
      brandEls.forEach(el => el.textContent = site.short_name || site.lab_name || 'Lab');
      const titleEl = $('#site-title'); if(titleEl) titleEl.textContent = site.lab_name || 'Your Lab';
      const taglineEl = $('#site-tagline'); if(taglineEl) taglineEl.textContent = site.tagline || '';
      const emailEl = $('#site-email'); if(emailEl){ emailEl.textContent = site.email || ''; if(site.email) emailEl.href = `mailto:${site.email}`; }
      const ghEl = $('#site-github'); if(ghEl && site.github) ghEl.href = site.github;
      const xEl = $('#site-x'); if(xEl && site.x) xEl.href = site.x;
      const addrEl = $('#site-address'); if(addrEl) addrEl.textContent = site.address || '';
      document.title = site.lab_name || document.title;
    } catch(e){ console.warn('site.json load failed', e); }
  }

  function setYear(){ const y = $('#year'); if(y) y.textContent = new Date().getFullYear(); }

  async function renderNews(){
    const container = $('[data-bind="news-preview"]') || $('#news-list');
    if(!container) return;
    try {
      const res = await fetch('data/news.json'); const items = await res.json();
      items.sort((a,b)=> new Date(b.date)-new Date(a.date));
      const subset = container.id === 'news-list' ? items : items.slice(0,3);
      container.innerHTML = subset.map(n => `
        <div class="news-card">
          <strong>${n.date}</strong> — ${n.title} ${n.link ? `· <a href="${n.link}" target="_blank" rel="noopener">link</a>`:''}
        </div>`).join('');
    } catch(e){ console.warn('news load failed', e); }
  }

  function normalize(s){ return (s||'').toLowerCase(); }

  async function renderPublications(){
    const list = $('#pub-list');
    const featuredWrap = $('[data-bind="pubs-featured"]');
    if(!list && !featuredWrap) return;
    try{
      const res = await fetch('data/publications.json'); let pubs = await res.json();
      // Featured on home
      if(featuredWrap){
        const featured = pubs.filter(p=>p.featured).slice(0,3);
        featuredWrap.innerHTML = featured.map(cardPub).join('');
      }
      // Full list w/ filters
      if(list){
        const q = $('#q'), year = $('#year'), ptype = $('#ptype'), sort = $('#sort');
        // populate year options
        const years = [...new Set(pubs.map(p=>p.year))].sort((a,b)=>b-a);
        year.innerHTML += years.map(y=>`<option value="${y}">${y}</option>`).join('');

        function apply(){
          let view = pubs.slice();
          const qs = normalize(q.value);
          const yr = year.value; const ty = ptype.value;
          if(qs){
            view = view.filter(p=>[p.title, p.authors?.join(' '), p.tags?.join(' ')].some(f => normalize(f).includes(qs)));
          }
          if(yr) view = view.filter(p=> String(p.year) === yr);
          if(ty) view = view.filter(p=> (p.type||'') === ty);
          const s = sort.value;
          if(s === 'year_desc') view.sort((a,b)=> b.year - a.year);
          if(s === 'year_asc') view.sort((a,b)=> a.year - b.year);
          if(s === 'alpha') view.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
          list.innerHTML = view.map(fullPub).join('');
        }
        [q,year,ptype,sort].forEach(el=> el.addEventListener('input', apply));
        apply();
      }
    } catch(e){ console.warn('pubs load failed', e); }
  }

  function cardPub(p){
    return `<article class="card">
      <div style="height:120px;border-radius:12px;background:linear-gradient(135deg, var(--accent), var(--accent-2));"></div>
      <h3 style="margin:8px 0 2px 0">${p.title}</h3>
      <p class="muted">${(p.authors||[]).join(', ')} · ${p.venue||''} · ${p.year||''}</p>
      <div class="tag-row">${(p.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
        ${p.pdf? `<a class="btn" href="${p.pdf}" target="_blank" rel="noopener">PDF</a>`:''}
        ${p.code? `<a class="btn" href="${p.code}" target="_blank" rel="noopener">Code</a>`:''}
        ${p.doi? `<a class="btn" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI</a>`:''}
      </div>
    </article>`;
  }

  function fullPub(p){
    return `<div class="pub-item">
      <strong>${p.title}</strong><br>
      <span class="muted">${(p.authors||[]).join(', ')}</span><br>
      <span>${p.venue||''} ${p.year||''}</span><br>
      ${p.abstract? `<details style="margin-top:6px"><summary>Abstract</summary><p>${p.abstract}</p></details>`:''}
      <div class="tag-row" style="margin-top:6px">${(p.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
        ${p.pdf? `<a class="btn" href="${p.pdf}" target="_blank" rel="noopener">PDF</a>`:''}
        ${p.code? `<a class="btn" href="${p.code}" target="_blank" rel="noopener">Code</a>`:''}
        ${p.dataset? `<a class="btn" href="${p.dataset}" target="_blank" rel="noopener">Dataset</a>`:''}
        ${p.doi? `<a class="btn" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI</a>`:''}
      </div>
    </div>`;
  }

  async function renderProjects(){
    const grid = $('#projects-grid') || $('[data-bind="projects-preview"]');
    if(!grid) return;
    try{
      const res = await fetch('data/projects.json'); let ps = await res.json();
      // Preview 3 on home
      const preview = grid.getAttribute('data-bind') === 'projects-preview';
      if(preview) ps = ps.filter(p=>p.featured).slice(0,3);
      const q = $('#pq'); const status = $('#pstatus');
      function draw(list){
        grid.innerHTML = list.map(p=>`
          <article class="card">
            <div style="height:130px;border-radius:12px;background:linear-gradient(135deg, ${p.gradient||'#10b981'}, ${p.gradient2||'#3b82f6'});"></div>
            <h3 style="margin:8px 0 2px 0">${p.title}</h3>
            <p class="muted">${p.summary||''}</p>
            <div class="tag-row">${(p.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
            <div style="margin-top:6px">
              ${p.link? `<a class="btn" href="${p.link}" target="_blank" rel="noopener">Learn more</a>`:''}
            </div>
          </article>`).join('');
      }
      if(q || status){
        function apply(){
          let view = ps.slice();
          if(q && q.value){ const s = normalize(q.value); view = view.filter(p=> normalize(p.title).includes(s) || normalize(p.summary).includes(s) || (p.tags||[]).some(t=>normalize(t).includes(s))); }
          if(status && status.value){ view = view.filter(p=> (p.status||'') === status.value); }
          draw(view);
        }
        [q,status].forEach(el=> el && el.addEventListener('input', apply));
        apply();
      } else {
        draw(ps);
      }
    } catch(e){ console.warn('projects load failed', e); }
  }

  async function renderPeople(){
    const wrap = $('#people-grid');
    if(!wrap) return;
    try{
      const res = await fetch('data/people.json'); const ppl = await res.json();
      const makeCard = (person) => `
        <div class="person">
          <div class="pic" aria-hidden="true"></div>
          <strong>${person.name}</strong><br>
          <span class="muted">${person.role}${person.affiliation? ', '+person.affiliation:''}</span><br>
          ${person.email? `<a href="mailto:${person.email}">${person.email}</a>`:''}
          <div class="tag-row" style="margin-top:6px">
            ${person.github? `<a class="chip" href="${person.github}" target="_blank" rel="noopener">GitHub</a>`:''}
            ${person.web? `<a class="chip" href="${person.web}" target="_blank" rel="noopener">Web</a>`:''}
          </div>
        </div>`;
      const sections = ['pi','postdocs','phd','ms','ug','alumni'];
      wrap.innerHTML = sections.map(key => {
        const list = ppl[key]||[]; if(!list.length) return '';
        const titleMap = {pi:'Principal Investigator', postdocs:'Postdocs', phd:'Ph.D.', ms:'M.S.', ug:'Undergraduate', alumni:'Alumni'};
        return `<section class="card"><h3 style="margin:0 0 8px 0">${titleMap[key]}</h3><div class="people">${list.map(makeCard).join('')}</div></section>`;
      }).join('');
    } catch(e){ console.warn('people load failed', e); }
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    setYear();
    loadSiteMeta();
    renderNews();
    renderPublications();
    renderProjects();
    renderPeople();
  });
})();
