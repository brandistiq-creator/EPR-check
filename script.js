(() => {
  const state = { countries: [], volume: '', packaging: [] };
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  const countryButtons = qsa('[data-country]');
  const volumeButtons = qsa('[data-volume]');
  const packagingButtons = qsa('[data-packaging]');
  const runButton = qs('#run-check');
  const result = qs('#result');
  const progress = qs('#progressBar');
  const leadForm = qs('#leadform');

  function toggle(button, active) {
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  }

  countryButtons.forEach(btn => btn.addEventListener('click', () => {
    const value = btn.dataset.country;
    if (state.countries.includes(value)) state.countries = state.countries.filter(x => x !== value);
    else state.countries.push(value);
    toggle(btn, state.countries.includes(value));
    updateSelectionHints();
  }));

  volumeButtons.forEach(btn => btn.addEventListener('click', () => {
    state.volume = btn.dataset.volume || '';
    volumeButtons.forEach(x => toggle(x, x === btn));
    updateSelectionHints();
  }));

  packagingButtons.forEach(btn => btn.addEventListener('click', () => {
    const value = btn.dataset.packaging;
    if (state.packaging.includes(value)) state.packaging = state.packaging.filter(x => x !== value);
    else state.packaging.push(value);
    toggle(btn, state.packaging.includes(value));
    updateSelectionHints();
  }));

  function updateSelectionHints() {
    const ch = qs('#countrySelectionHint');
    const vh = qs('#volumeSelectionHint');
    const ph = qs('#packagingSelectionHint');
    if (ch) ch.innerHTML = '<strong>Odabrano:</strong> ' + (state.countries.length ? state.countries.join(', ') : 'ništa');
    if (vh) vh.innerHTML = '<strong>Odabrano:</strong> ' + (state.volume ? volumeLabel(state.volume) : 'ništa');
    if (ph) ph.innerHTML = '<strong>Odabrano:</strong> ' + (state.packaging.length ? state.packaging.map(packagingLabel).join(', ') : 'ništa');
  }

  function volumeLabel(v) {
    return ({'50':'1–50','250':'51–250','251':'251–1.000','1001':'1.001+'})[v] || 'nije odabrano';
  }
  function packagingLabel(v) {
    return ({karton:'Karton',papir:'Papir',plastika:'Plastika',staklo:'Staklo',drvo:'Drvo',ostalo:'Ostalo'})[v] || v;
  }
  function updateReportFields() {
    const countries = state.countries.join(', ');
    const packaging = state.packaging.map(packagingLabel).join(', ');
    const volume = volumeLabel(state.volume);
    const c = qs('#selectedCountries'); if (c) c.value = countries;
    const v = qs('#selectedVolume'); if (v) v.value = volume;
    const p = qs('#selectedPackaging'); if (p) p.value = packaging;
    const summary = qs('#checkSummary');
    const summaryText = qs('#checkSummaryText');
    const scope = qs('#scopeField');
    if (summary && summaryText && (state.countries.length || state.volume || state.packaging.length)) {
      summary.style.display = 'block';
      summaryText.innerHTML = `<strong>Tržišta:</strong> ${countries || '—'}<br><strong>Pošiljke:</strong> ${volume}<br><strong>Ambalaža:</strong> ${packaging || '—'}`;
    }
    if (scope) {
      const existing = scope.dataset.userEdited === 'true';
      if (!existing) {
        scope.value = `Tržišta: ${countries || '—'}\nPošiljke godišnje: ${volume}\nAmbalaža: ${packaging || '—'}\n\nDodatne informacije: `;
      }
    }
  }

  if (qs('#scopeField')) qs('#scopeField').addEventListener('input', e => { e.target.dataset.userEdited = 'true'; });

  function renderResult() {
    const countries = state.countries;
    if (!countries.length || !state.volume || !state.packaging.length) {
      result.innerHTML = '<div class="result-warning"><strong>Dovršite provjeru.</strong><p>Odaberite barem jedno tržište, raspon pošiljki i jednu vrstu ambalaže.</p></div>';
      result.style.display = 'block';
      return;
    }
    const items = countries.map(c => `<li><strong>${c}</strong> — preporučujemo detaljnu provjeru registracije, EPR/PRO sustava, evidencije ambalaže, izvještavanja i mogućeg predstavnika.</li>`).join('');
    result.innerHTML = `
      <div class="result-title"><h3>Što trebate provjeriti</h3><span class="score">${countries.length} ${countries.length === 1 ? 'tržište' : 'tržišta'}</span></div>
      <p style="font-size:13px;color:#526174;line-height:1.6">Na temelju vaših odgovora izdvojili smo tržišta za koja ima smisla napraviti detaljniji pregled.</p>
      <ul class="result-list">${items}</ul>
      <div class="callout" style="margin-top:14px;padding:14px;background:#f7f9fc;border:1px solid #e6eaf0;border-radius:14px">
        <strong>Želite konkretan pregled?</strong><br>
        <span style="font-size:12px;color:#667085">EPR Report povezuje vaše odabrane države s relevantnim obvezama, službenim izvorima i početnim sljedećim koracima.</span>
      </div>
      <div class="actions" style="margin-top:14px"><a class="btn large" href="#lead" id="reportFromCheck">Zatraži EPR Report →</a></div>`;
    result.style.display = 'block';
    if (progress) progress.style.width = '100%';
    updateReportFields();
    const cta = qs('#reportFromCheck');
    if (cta) cta.addEventListener('click', () => setTimeout(() => { updateReportFields(); const first = qs('#leadform input[name="name"]'); if (first) first.focus(); }, 150));
  }

  if (runButton) runButton.addEventListener('click', renderResult);
  updateSelectionHints();

  // FAQ category filters
  qsa('.faq-filter').forEach(btn => btn.addEventListener('click', () => {
    qsa('.faq-filter').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter || 'all';
    qsa('#faqList [data-cat]').forEach(el => {
      el.style.display = filter === 'all' || el.dataset.cat === filter ? '' : 'none';
    });
  }));

  // Keep the selected Check data when the user reaches the Report form.
  if (leadForm) {
    leadForm.addEventListener('submit', () => updateReportFields());
  }

  // Restore a previous check when returning to the page with the anchor.
  try {
    const saved = JSON.parse(sessionStorage.getItem('eprCheckState') || 'null');
    if (saved) {
      Object.assign(state, saved);
      countryButtons.forEach(b => toggle(b, state.countries.includes(b.dataset.country)));
      volumeButtons.forEach(b => toggle(b, b.dataset.volume === state.volume));
      packagingButtons.forEach(b => toggle(b, state.packaging.includes(b.dataset.packaging)));
      updateReportFields();
      updateSelectionHints();
    }
    const save = () => sessionStorage.setItem('eprCheckState', JSON.stringify(state));
    [...countryButtons,...volumeButtons,...packagingButtons].forEach(b => b.addEventListener('click', save));
  } catch(e) {}
})();
