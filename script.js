
const selected=new Set();
document.querySelectorAll('.opt[data-country]').forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('active');const c=b.dataset.country;b.classList.contains('active')?selected.add(c):selected.delete(c)}));
const check=document.getElementById('run-check');
if(check)check.addEventListener('click',()=>{const result=document.getElementById('result');if(!selected.size){alert('Odaberite barem jednu državu.');return}result.innerHTML='<h3>Početna procjena</h3>'+[...selected].map(c=>`<div class="market"><strong>${c}</strong><span class="status ${c==="Hrvatska"?"green":"red"}">${c==="Hrvatska"?"Provjerite nacionalne obveze":"Detaljna provjera preporučena"}</span></div>`).join('')+'<div class="actions"><a class="btn" href="#report">Želim detaljan EPR Report</a></div><p class="notice">Ovo je informativni pre-check, ne pravno mišljenje i ne provjerava službene registre.</p>';result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'nearest'})});
const form=document.getElementById('leadform');
if(form)form.addEventListener('submit',e=>{e.preventDefault();document.getElementById('success').classList.add('show');form.reset()});
