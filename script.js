
document.addEventListener('DOMContentLoaded', () => {
  const state = { countries:new Set(), volume:null, packaging:new Set() };
  const countryButtons=document.querySelectorAll('.opt[data-country]');
  const volumeButtons=document.querySelectorAll('.opt[data-volume]');
  const packagingButtons=document.querySelectorAll('.opt[data-packaging]');
  const progress=document.getElementById('progressBar');
  const result=document.getElementById('result');
  const run=document.getElementById('run-check');

  function updateProgress(){
    const done=(state.countries.size?1:0)+(state.volume?1:0)+(state.packaging.size?1:0);
    if(progress) progress.style.width=`${Math.round(done/3*100)}%`;
  }

  countryButtons.forEach(btn=>btn.addEventListener('click',()=>{
    btn.classList.toggle('active');
    const value=btn.dataset.country;
    if(btn.classList.contains('active')) state.countries.add(value); else state.countries.delete(value);
    updateProgress();
  }));

  volumeButtons.forEach(btn=>btn.addEventListener('click',()=>{
    volumeButtons.forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    state.volume=btn.dataset.volume;
    updateProgress();
  }));

  packagingButtons.forEach(btn=>btn.addEventListener('click',()=>{
    btn.classList.toggle('active');
    const value=btn.dataset.packaging;
    if(btn.classList.contains('active')) state.packaging.add(value); else state.packaging.delete(value);
    updateProgress();
  }));

  function assessment(country){
    if(country.includes('Hrvatska')) return ['Provjerite nacionalne obveze','orange'];
    return ['Detaljna provjera preporučena','red'];
  }

  if(run){
    run.addEventListener('click',()=>{
      if(!state.countries.size){alert('Odaberite barem jednu državu.');return;}
      if(!state.volume){alert('Odaberite približan broj pošiljki.');return;}
      if(!state.packaging.size){alert('Odaberite barem jednu vrstu ambalaže.');return;}
      const countries=[...state.countries];
      const volumeWeight={50:3,250:6,251:9,1001:13}[state.volume]||3;
      const score=Math.min(98,30+countries.length*11+volumeWeight+state.packaging.size*4);
      result.innerHTML=`
        <div class="result-title"><h3>Vaša početna procjena</h3><span class="score">${score}/100</span></div>
        ${countries.map(c=>{const [label,cls]=assessment(c);return `<div class="market"><strong>${c}</strong><span class="status ${cls}">${label}</span></div>`}).join('')}
        <p class="result-note">Ovo je informativni pre-check, ne pravno mišljenje. Za konačnu procjenu potrebni su detalji o proizvodima, ambalaži i načinu prodaje.</p>
        <div class="actions"><a class="btn" href="#report">Želim detaljan EPR Report →</a></div>`;
      result.classList.add('show');
      result.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  }

  const form=document.getElementById('leadform');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const success=document.getElementById('success');
      if(success) success.classList.add('show');
      form.reset();
    });
  }
});
