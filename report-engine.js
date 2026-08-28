window.EPR_REPORT_ENGINE = (() => {
  const markets = {
    '🇩🇪 Njemačka': {market:'Njemačka', facts:['Provjeriti registraciju ambalaže i relevantan EPR/PRO sustav.','Provjeriti obveze izvještavanja i količinske podatke.'],url:'https://www.verpackungsregister.org/en/system-participation-data-reporting/overview-of-system-operators'},
    '🇦🇹 Austrija': {market:'Austrija', facts:['Provjeriti nacionalne obveze za ambalažu kod prekogranične prodaje.','Provjeriti registraciju, sustav zbrinjavanja i izvještavanje.'],url:'https://www.usp.gv.at/en/umwelt-verkehr/abfall-ressourcenmanagement/verpackungen.html'},
    '🇸🇮 Slovenija': {market:'Slovenija', facts:['Provjeriti slovenske EPR obveze za ambalažu i način izvještavanja.','Provjeriti treba li uključiti lokalnog predstavnika ili ovlaštenog partnera.'],url:'https://www.gov.si/en/topics/waste-and-waste-management/'},
    '🇮🇹 Italija': {market:'Italija', facts:['Provjeriti nacionalni sustav za ambalažu i primjenjive obveze prekograničnog prodavatelja.','Provjeriti registraciju, deklariranje materijala i izvještavanje.'],url:'https://www.conai.org/en/'},
    '🇭🇷 Hrvatska': {market:'Hrvatska', facts:['Provjeriti domaće obveze povezane s ambalažom i izvještavanjem.','Provjeriti relevantne registre i način obračuna obveza.'],url:'https://www.fzoeu.hr/'},
    '🇫🇷 Francuska': {market:'Francuska', facts:['Provjeriti francuske EPR sheme za ambalažu i obveze prekogranične prodaje.','Provjeriti registraciju, identifikatore i izvještavanje.'],url:'https://www.ecologie.gouv.fr/' }
  };
  function buildDraft(data={}) {
    const selected = Array.isArray(data.countries) ? data.countries : String(data['selected-countries']||'').split(',').map(x=>x.trim()).filter(Boolean);
    const ms = selected.map(x=>markets[x]).filter(Boolean);
    return {reportId:'EPR-'+Date.now().toString(36).toUpperCase(),client:{name:data.name||'',email:data.email||'',webshop:data.webshop||''},markets:ms};
  }
  return {buildDraft};
})();
