const API = "https://api.netlify.com/api/v1";

function headers(token){
  return { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
}
function esc(v){
  return String(v ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
function pick(data, keys){
  const entries = Object.entries(data || {});
  for(const k of keys){
    const hit = entries.find(([name]) =>
      name.toLowerCase().replace(/[^a-z0-9čćđšž]/g,"").includes(k)
    );
    if(hit && hit[1]) return Array.isArray(hit[1]) ? hit[1].join(", ") : hit[1];
  }
  return "";
}
function allText(data){ return Object.entries(data||{}).map(([k,v])=>`${k} ${v}`).join(" "); }
function countriesFrom(data){
  const t=allText(data).toLowerCase();
  const out=[];
  if(/njemačk|german|deutschland/.test(t)) out.push("DE");
  if(/austrij|austria|österreich/.test(t)) out.push("AT");
  if(/sloven|slovenia|slowen/.test(t)) out.push("SI");
  if(/italij|italy|italia/.test(t)) out.push("IT");
  if(/franc|france/.test(t)) out.push("FR");
  return [...new Set(out)];
}
function countryRule(code){
  const rules={
    DE:{
      flag:"🇩🇪", name:"Njemačka",
      system:"LUCID Packaging Register (ZSVR) + system participation gdje se primjenjuje.",
      steps:[
        ["Provjeriti status obveznika","Prikupite popis proizvoda, model prodaje, ambalažne komponente, materijale i mase. Potvrdite ulazi li konkretna ambalaža u relevantnu obvezu."],
        ["Registrirati subjekt u LUCID-u","Na službenoj stranici ZSVR-a otvorite registraciju, unesite podatke tvrtke i relevantne brandove te spremite LUCID broj."],
        ["Provjeriti ovlaštenog predstavnika","Ako se primjenjuje režim za stranog prodavatelja, provjerite uvjete i postupak imenovanja predstavnika u LUCID-u."],
        ["Ugovoriti system participation","Ako ambalaža podliježe system participation obvezi, odaberite odobrenog operatora, ugovorite sudjelovanje i prijavite količine."],
        ["Prijaviti količine","Uskladite količine prijavljene operatoru i LUCID-u, po materijalu i razdoblju."],
        ["Postaviti evidenciju i rokove","Vodite proizvod → komponenta → materijal → masa → broj pošiljki te sačuvajte dokaz izračuna i rokove."],
      ],
      sources:[
        ["ZSVR — LUCID registracija","https://www.verpackungsregister.org/en/registration/find-out-about-registrations"],
        ["ZSVR — System participation & data reporting","https://www.verpackungsregister.org/en/information-system-participation-and-data-reporting"],
        ["ZSVR — Data reporting in LUCID","https://www.verpackungsregister.org/en/help/data-reporting-in-lucid"],
        ["ZSVR — Authorised representatives","https://www.verpackungsregister.org/en/knowledge-bases/authorising-a-representative"]
      ]
    },
    AT:{
      flag:"🇦🇹", name:"Austrija",
      system:"Sustav sakupljanja i oporabe ambalaže prema austrijskim pravilima EPR.",
      steps:[
        ["Potvrditi model prodaje","Utvrditi prodaje li se krajnjim korisnicima na daljinu i koja se ambalaža stavlja na austrijsko tržište."],
        ["Provjeriti EPR/PRO sudjelovanje","Identificirati primjenjivi sustav i uvjete sudjelovanja prema konkretnoj ulozi subjekta."],
        ["Provjeriti predstavnika","Za strani prodavatelj bez sjedišta ili poslovne jedinice provjeriti obvezu ovlaštenog predstavnika i postupak imenovanja."],
        ["Pripremiti evidenciju ambalaže","Razvrstati ambalažu po materijalu i voditi mase po razdoblju."],
        ["Uspostaviti izvještavanje","Prema primjenjivom sustavu voditi i dostavljati podatke u propisanom obliku i rokovima."]
      ],
      sources:[
        ["USP Österreich — službene informacije o ambalaži","https://www.usp.gv.at/umwelt-verkehr/abfall-ressourcen/erweiterte-herstellerverantwortung.html"]
      ]
    },
    SI:{
      flag:"🇸🇮", name:"Slovenija",
      system:"Evidencija proizvođača — Embalaža + PRO obveze, ovisno o ulozi subjekta.",
      steps:[
        ["Potvrditi status subjekta","Utvrditi tko stavlja ambalažu na slovensko tržište i model prodaje krajnjim korisnicima."],
        ["Provjeriti upis u evidenciju","Provjeriti primjenjuje li se upis proizvođača za ambalažu te tko podnosi upis za strano poduzeće."],
        ["Provjeriti predstavnika","Ako se primjenjuje režim za strano poduzeće, provjeriti zahtjev za ovlaštenim zastupnikom."],
        ["Uspostaviti PRO postupak","Identificirati primjenjivi PRO sustav i način ispunjavanja obveza."],
        ["Voditi evidenciju i izvještavanje","Pripremiti mase ambalaže po materijalu i podatke potrebne za prijave."]
      ],
      sources:[
        ["GOV.SI — službene informacije","https://www.gov.si/teme/odpadki/"]
      ]
    },
    IT:{
      flag:"🇮🇹", name:"Italija",
      system:"Potrebna je provjera konkretnog modela prodaje, vrste ambalaže i primjenjivog CONAI režima.",
      steps:[
        ["Potvrditi obveznika i opseg","Ovaj dio treba potvrditi prema stvarnom poslovnom modelu i ambalaži prije isporuke klijentu."],
        ["Provjeriti registraciju i CONAI obveze","Ručno provjeriti aktualne službene zahtjeve i primjenjive procedure."],
        ["Pripremiti podatke o ambalaži","Razvrstati količine po materijalu i čuvati osnovu izračuna."],
        ["Provjeriti deklariranje i izvještavanje","Potvrditi aktualne rokove i način prijave iz službenih izvora."]
      ],
      sources:[["CONAI — službena stranica","https://www.conai.org/en/"]]
    },
    FR:{
      flag:"🇫🇷", name:"Francuska",
      system:"Potrebna je provjera konkretnog proizvoda, ambalaže i primjenjivog REP režima.",
      steps:[
        ["Potvrditi primjenjivi REP režim","Utvrditi vrste proizvoda/ambalaže i ulogu stranog prodavatelja."],
        ["Provjeriti registraciju i identifikator","Ručno potvrditi aktualne zahtjeve za registraciju i identifikaciju kod nadležnog sustava."],
        ["Pripremiti podatke o ambalaži","Razvrstati materijale, mase i količine stavljene na francusko tržište."],
        ["Provjeriti izvještavanje","Potvrditi aktualne procedure, rokove i eventualne obveze označavanja."]
      ],
      sources:[["ADEME — REP službene informacije","https://filieres-rep.ademe.fr/"]]
    }
  };
  return rules[code];
}

async function netlify(path, token){
  const r=await fetch(API+path,{headers:headers(token)});
  const text=await r.text();
  if(!r.ok) throw new Error(`Netlify API ${r.status}: ${text}`);
  return JSON.parse(text);
}

function auth(req){
  const expected=process.env.EPR_ADMIN_PASSWORD;
  const supplied=req.headers.get("x-admin-password") || "";
  if(!expected || supplied !== expected) return false;
  return true;
}

async function getForm(token){
  const forms=await netlify(`/sites/${process.env.SITE_ID}/forms`,token);
  const form=forms.find(f=>(f.name||"").toLowerCase()==="epr-report");
  if(!form) throw new Error("Forma epr-report nije pronađena.");
  return form;
}

function layout(title, body){
return `<!doctype html><html lang="hr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>
:root{--ink:#101828;--muted:#667085;--blue:#1463ff;--line:#e4e7ec;--soft:#f5f8ff;--green:#067647;--orange:#b54708}
*{box-sizing:border-box}body{margin:0;background:#f6f8fb;color:var(--ink);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.55}.wrap{max-width:980px;margin:auto;padding:34px 18px 70px}.page{background:#fff;border:1px solid var(--line);border-radius:22px;padding:38px;margin-bottom:18px;box-shadow:0 10px 35px rgba(16,24,40,.05)}.kicker{color:var(--blue);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}h1{font-size:38px;line-height:1.08;margin:10px 0}h2{font-size:24px;margin:28px 0 12px}h3{font-size:17px;margin:18px 0 7px}p{color:#344054}.meta{display:grid;grid-template-columns:1fr 2fr;border:1px solid var(--line);border-radius:15px;overflow:hidden;margin:24px 0}.meta div{padding:12px 15px;border-bottom:1px solid var(--line)}.meta div:nth-child(odd){background:var(--soft);font-size:12px;font-weight:800;color:var(--muted)}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.card{border:1px solid var(--line);border-radius:16px;padding:18px}.status{display:inline-block;background:#ecfdf3;color:var(--green);border-radius:999px;padding:5px 9px;font-size:11px;font-weight:800}.step{border:1px solid var(--line);border-radius:16px;padding:18px;margin:13px 0}.step .num{font-weight:900;color:var(--blue)}li{margin:8px 0}.source{margin:8px 0}.source a{color:#1452c7}.note{background:#fff7ed;border:1px solid #fed7aa;padding:15px;border-radius:14px;color:#7c2d12;font-size:13px}@media(max-width:650px){.page{padding:24px 19px}h1{font-size:30px}.grid{grid-template-columns:1fr}.meta{grid-template-columns:1fr}}@media print{body{background:#fff}.wrap{max-width:none;padding:0}.page{box-shadow:none;border:0;border-radius:0;page-break-after:always;margin:0}}
</style></head><body><div class="wrap">${body}</div></body></html>`;
}

function renderReport(s){
  const d=s.data||{};
  const name=pick(d,["imeiprezime","nazivposlovnogsubjekta","company","name","klijent"])||s.name||"Klijent";
  const email=pick(d,["email","e-mail"])||s.email||"";
  const website=pick(d,["webshop","webstranica","website","web"])||"";
  const address=pick(d,["adresa","address"])||"";
  const phone=pick(d,["telefon","phone"])||"";
  const countries=countriesFrom(d);
  const rules=countries.map(countryRule).filter(Boolean);

  const raw=Object.entries(d).filter(([k,v])=>v!=="" && v!==null && v!==undefined)
    .map(([k,v])=>`<div><b>${esc(k)}</b></div><div>${esc(Array.isArray(v)?v.join(", "):v)}</div>`).join("");

  const countryCards=rules.map(r=>`<div class="card"><div style="font-size:24px">${r.flag}</div><b>${r.name}</b><p>${esc(r.system)}</p><span class="status">ZA OBRADU</span></div>`).join("");

  const countrySections=rules.map(r=>{
    const steps=r.steps.map((st,i)=>`<div class="step"><div class="num">0${i+1} · ${esc(st[0])}</div><p>${esc(st[1])}</p><h3>Što napraviti</h3><ol><li>Provjeriti konkretne podatke iz vaše prijave.</li><li>Otvoriti službeni izvor naveden u Reportu.</li><li>Sačuvati potvrdu, registraciju ili drugi dokaz nakon izvršenog koraka.</li></ol></div>`).join("");
    const sources=r.sources.map(x=>`<div class="source">• <a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a></div>`).join("");
    return `<section class="page"><div class="kicker">${r.flag} EPR REPORT</div><h1>${esc(r.name)}</h1><p><b>EPR sustav:</b> ${esc(r.system)}</p><h2>Operativni plan</h2>${steps}<h2>Službeni izvori</h2>${sources}</section>`;
  }).join("");

  const noRules=!rules.length ? `<section class="page"><div class="kicker">MANUAL REVIEW</div><h1>Potrebna ručna provjera</h1><p>Iz prijave nije moguće pouzdano odrediti odabrana tržišta. Prije slanja klijentu treba otvoriti izvornu prijavu i ručno potvrditi države, model prodaje i vrstu ambalaže.</p></section>`:"";

  return layout("EPR Report — "+name,`
<section class="page"><div class="kicker">EPR REPORT · RADNA VERZIJA</div><h1>Personalizirani pregled EPR obveza</h1>
<p>Ovaj dokument pretvara podatke iz prijave u operativni plan. Prije slanja klijentu sadržaj treba pregledati prema aktualnim službenim pravilima.</p>
<div class="meta"><div>KLIJENT</div><div>${esc(name)}</div><div>EMAIL</div><div>${esc(email)}</div><div>WEB SHOP</div><div>${esc(website)}</div><div>ADRESA</div><div>${esc(address)}</div><div>TELEFON</div><div>${esc(phone)}</div><div>DATUM PRIJAVE</div><div>${esc(new Date(s.created_at).toLocaleString("hr-HR"))}</div></div>
<h2>Obuhvat</h2><div class="grid">${countryCards || '<div class="card">Države nisu pouzdano prepoznate iz prijave.</div>'}</div>
<div class="note" style="margin-top:18px"><b>Važno:</b> Ovo nije pravno mišljenje. Report ne uključuje registraciju, podnošenje prijava ili sklapanje ugovora u ime klijenta. Sadržaj za svako tržište mora se provjeriti prema aktualnim službenim izvorima prije konačne isporuke.</div>
</section>
${countrySections}${noRules}
<section class="page"><div class="kicker">PODACI IZ PRIJAVE</div><h1>Ulazni podaci</h1><div class="meta">${raw || "<div>Nema dodatnih podataka.</div>"}</div>
<h2>Sljedeći korak</h2><ol><li>Pregledati ovaj nacrt.</li><li>Potvrditi države, model prodaje i vrste ambalaže.</li><li>Provjeriti aktualne službene izvore za svaku državu.</li><li>Tek nakon kontrole poslati konačni Report klijentu.</li></ol></section>`);
}

exports.handler = async (event)=>{
  try{
    if(!auth({headers:new Map(Object.entries(Object.fromEntries(Object.entries(event.headers||{}).map(([k,v])=>[k.toLowerCase(),v]))))})){
      return {statusCode:401,headers:{"content-type":"application/json"},body:JSON.stringify({error:"Unauthorized"})};
    }
    const token=process.env.NETLIFY_AUTH_TOKEN;
    if(!token) throw new Error("Nedostaje NETLIFY_AUTH_TOKEN u Netlify Environment Variables.");
    if(!process.env.SITE_ID) throw new Error("Nedostaje SITE_ID.");
    const qs=event.queryStringParameters||{};
    const form=await getForm(token);
    if(qs.action==="list"){
      const submissions=await netlify(`/forms/${form.id}/submissions`,token);
      return {statusCode:200,headers:{"content-type":"application/json","cache-control":"no-store"},body:JSON.stringify({form:form.name,submissions})};
    }
    if(qs.action==="report" && qs.id){
      const submissions=await netlify(`/forms/${form.id}/submissions`,token);
      const s=submissions.find(x=>x.id===qs.id);
      if(!s) return {statusCode:404,headers:{"content-type":"application/json"},body:JSON.stringify({error:"Prijava nije pronađena."})};
      return {statusCode:200,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"},body:renderReport(s)};
    }
    return {statusCode:400,headers:{"content-type":"application/json"},body:JSON.stringify({error:"Nepoznata akcija."})};
  }catch(e){
    return {statusCode:500,headers:{"content-type":"application/json"},body:JSON.stringify({error:e.message||"Greška"})};
  }
};
