
const state = {
  countries: new Set(),
  volume: null,
  packaging: new Set()
};

const countryButtons = document.querySelectorAll('.opt[data-country]');
const volumeButtons = document.querySelectorAll('.opt[data-volume]');
const packagingButtons = document.querySelectorAll('.opt[data-packaging]');
const allOptions = document.querySelectorAll('.opt');

countryButtons.forEach(btn => btn.addEventListener('click', () => {
  btn.classList.toggle('active');
  const value = btn.dataset.country;
  btn.classList.contains('active') ? state.countries.add(value) : state.countries.delete(value);
  updateProgress();
}));

volumeButtons.forEach(btn => btn.addEventListener('click', () => {
  volumeButtons.forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  state.volume = btn.dataset.volume;
  updateProgress();
}));

packagingButtons.forEach(btn => btn.addEventListener('click', () => {
  btn.classList.toggle('active');
  const value = btn.dataset.packaging;
  btn.classList.contains('active') ? state.packaging.add(value) : state.packaging.delete(value);
  updateProgress();
}));

function updateProgress(){
  const done = (state.countries.size ? 1 : 0) + (state.volume ? 1 : 0) + (state.packaging.size ? 1 : 0);
  const bar = document.getElementById('progressBar');
  if(bar) bar.style.width = `${Math.round(done/3*100)}%`;
}

function countryAssessment(country){
  if(country.includes('Njemačka')) return ['Detaljna provjera preporučena','red'];
  if(country.includes('Austrija')) return ['Detaljna provjera preporučena','red'];
  if(country.includes('Slovenija')) return ['Detaljna provjera preporučena','red'];
  if(country.includes('Italija')) return ['Detaljna provjera preporučena','red'];
  if(country.includes('Hrvatska')) return ['Provjerite nacionalne obveze','orange'];
  return ['Provjerite nacionalne obveze','orange'];
}

const run = document.getElementById('run-check');
if(run){
  run.addEventListener('click', () => {
    if(!state.countries.size){ alert('Odaberite barem jednu državu.'); return; }
    if(!state.volume){ alert('Odaberite približan broj EU pošiljki.'); return; }
    if(!state.packaging.size){ alert('Odaberite barem jednu vrstu ambalaže.'); return; }

    const countries = [...state.countries];
    const score = Math.min(98, 30 + countries.length*12 + (state.volume === '1001' ? 12 : state.volume === '251' ? 8 : 3) + state.packaging.size*4);
    const result = document.getElementById('result');
    result.innerHTML = `
      <div class="result-title"><h3>Vaša početna procjena</h3><span class="score">${score}/100</span></div>
      ${countries.map(c => {
        const [label, cls] = countryAssessment(c);
        return `<div class="market"><strong>${c}</strong><span class="status ${cls}">${label}</span></div>`;
      }).join('')}
      <p class="result-note">Rezultat je informativni pre-check. Konačna obveza ovisi o konkretnom proizvodu, ambalaži, načinu prodaje i pravilima države.</p>
      <div class="actions"><a class="btn" href="#report">Želim detaljan EPR Report</a></div>
    `;
    result.classList.add('show');
    result.scrollIntoView({behavior:'smooth', block:'nearest'});
  });
}

const form = document.getElementById('leadform');
if(form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('success').classList.add('show');
    form.reset();
  });
}
