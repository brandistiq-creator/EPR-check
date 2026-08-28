window.EPR_REPORT_ENGINE = (() => {
  const markets = {
    '🇩🇪 Njemačka': {
      market:'Njemačka', status:'visoka relevantnost za detaljnu provjeru',
      system:'LUCID Packaging Register + sustav sudjelovanja (system participation)',
      registration:'Provjeriti/izvršiti registraciju u LUCID-u prije stavljanja relevantne ambalaže na njemačko tržište.',
      packaging:'Pripremiti količine po materijalu, uključujući relevantnu prodajnu, grupnu i transportnu/poštansku ambalažu.',
      reporting:'Podaci prijavljeni sustavu moraju biti usklađeni s podacima prijavljenima LUCID-u; učestalost ovisi o ugovoru sa sustavom.',
      representative:'Za određene strane subjekte bez poslovnog nastana u Njemačkoj relevantno je imenovanje ovlaštenog predstavnika; provjeriti primjenu na konkretan slučaj.',
      authority:'Zentrale Stelle Verpackungsregister (ZSVR)',
      source:'https://www.verpackungsregister.org/en/information-system-participation-and-data-reporting',
      sourceLabel:'ZSVR — system participation and data reporting'
    },
    '🇦🇹 Austrija': {
      market:'Austrija', status:'visoka relevantnost za detaljnu provjeru',
      system:'Odobreni sustav prikupljanja i oporabe ambalaže prema austrijskom okviru.',
      registration:'Provjeriti obvezu sudjelovanja/licenciranja za konkretne vrste ambalaže i ulogu stranog prodavatelja.',
      packaging:'Pripremiti podatke o vrsti i masi ambalaže te razdvojiti relevantne kategorije prema austrijskom sustavu.',
      reporting:'Provjeriti način vođenja evidencije i izvještavanja za konkretan status obveznika.',
      representative:'Za strane prodavatelje na daljinu koji bez sjedišta/nastana u Austriji prodaju ambalažu ili robu u ambalaži privatnim krajnjim potrošačima postoji obveza imenovanja ovlaštenog predstavnika prema austrijskom okviru.',
      authority:'Bundesministerium für Land- und Forstwirtschaft, Klima- und Umweltschutz, Regionen und Wasserwirtschaft (BMLUK)',
      source:'https://www.usp.gv.at/themen/betrieb-und-umwelt/abfallrecht/weitere-informationen-abfallrecht/abfall-und-produktregelungen/transport-und-verkaufsverpackungen/bevollmaechtigte-fuer-verpackungen-und-einwegkunststoffprodukte.html',
      sourceLabel:'USP Austria — authorised representatives for packaging'
    },
    '🇸🇮 Slovenija': {
      market:'Slovenija', status:'relevantno za detaljnu provjeru',
      system:'Nacionalni sustav proširene odgovornosti proizvođača za ambalažu.',
      registration:'Provjeriti status obveznika, način uključivanja u sustav i aktualnu proceduru za prekograničnog prodavatelja.',
      packaging:'Pripremiti podatke po materijalima; službeni izvori navode papir/karton, plastiku, drvo, metal, staklo, kompozite i druge materijale.',
      reporting:'Provjeriti aktualni način prijave količina i obveze prema odabranom sustavu/procesu.',
      representative:'Provjeriti primjenu pravila o lokalnom predstavniku na konkretan prekogranični model prodaje.',
      authority:'Ministarstvo nadležno za okoliš / slovenski sustav gospodarenja otpadom',
      source:'https://www.gov.si/en/topics/waste-and-waste-management/',
      sourceLabel:'GOV.SI — waste and EPR framework'
    },
    '🇮🇹 Italija': {
      market:'Italija', status:'relevantno za detaljnu provjeru',
      system:'CONAI i relevantni sustavi za ambalažu, uz provjeru primjene na strani webshop i način prodaje.',
      registration:'Provjeriti status stranog poduzetnika i primjenu obveza prema načinu stavljanja pakiranih proizvoda na talijansko tržište, uključujući e-commerce situacije.',
      packaging:'Pripremiti masu ambalaže po materijalu i podatke potrebne za eventualni EPR doprinos.',
      reporting:'Provjeriti obveze deklariranja i plaćanja doprinosa prema konkretnom lancu prodaje i statusu subjekta.',
      representative:'Provjeriti postoji li posebna procedura/domicil ili drugi zahtjev za strani subjekt u konkretnom modelu prodaje.',
      authority:'CONAI',
      source:'https://www.conai.org/en/faq-conai/',
      sourceLabel:'CONAI — FAQ for foreign companies and e-commerce'
    },
    '🇭🇷 Hrvatska': {
      market:'Hrvatska', status:'relevantno za domaće obveze',
      system:'RPPO — Registar proizvođača s proširenom odgovornosti.',
      registration:'Provjeriti registraciju u RPPO-u prije prve prijave podataka za kategorije za koje postoji obveza.',
      packaging:'Pripremiti podatke o ambalaži i količinama po relevantnim materijalima; sustav obuhvaća različite vrste ambalaže.',
      reporting:'RPPO je digitalni sustav za prijavu podataka; rokovi ovise o kategoriji. Za ambalažu se primjenjuju pravila FZOEU-a za obračunsko razdoblje i rok prijave.',
      representative:'Za domaći subjekt u pravilu nije tema lokalnog predstavnika; ako je riječ o stranom subjektu, provjeriti poseban status.',
      authority:'Fond za zaštitu okoliša i energetsku učinkovitost (FZOEU)',
      source:'https://rppo.fzoeu.hr/',
      sourceLabel:'FZOEU — RPPO'
    },
    '🇫🇷 Francuska': {
      market:'Francuska', status:'relevantno za detaljnu provjeru',
      system:'Francuski REP sustav (Responsabilité Élargie du Producteur) i relevantna ambalažna filijera.',
      registration:'Provjeriti status proizvođača u Francuskoj prema načinu stavljanja proizvoda na tržište i primjenjivu REP filijaru.',
      packaging:'Utvrditi pripada li ambalaža kućanskoj, profesionalnoj ili drugoj relevantnoj REP filijeri te pripremiti podatke po materijalu.',
      reporting:'Provjeriti obvezu prijave/članstva kod relevantnog eco-organisme i način deklariranja količina.',
      representative:'Provjeriti ulogu stranog prodavatelja, marketplacea i eventualnog predstavnika prema konkretnom modelu prodaje.',
      authority:'ADEME / francuski sustav filijera REP',
      source:'https://filieres-rep.ademe.fr/acteurs/producteurs',
      sourceLabel:'ADEME — producers under REP'
    }
  };

  const labels = {
    '1–50':'1–50', '51–250':'51–250', '251–1.000':'251–1.000', '1.001+':'1.001+',
    '50':'1–50', '250':'51–250', '251':'251–1.000', '1001':'1.001+'
  };

  function normalizeCountries(data={}) {
    const raw = Array.isArray(data.countries) ? data.countries : String(data['selected-countries']||'').split(',').map(x=>x.trim()).filter(Boolean);
    return raw.map(x=>markets[x] ? x : Object.keys(markets).find(k => k.includes(x))).filter(Boolean);
  }

  function buildDraft(data={}) {
    const selected = normalizeCountries(data);
    const volume = labels[data.volume] || data['selected-volume'] || 'nije navedeno';
    const packaging = data.packaging || data['selected-packaging'] || 'nije navedeno';
    const ms = selected.map(x=>markets[x]).filter(Boolean).map(m=>({
      ...m,
      evidence:[
        'Potvrditi točan status prodavatelja i način stavljanja proizvoda na tržište.',
        'Pripremiti stvarne količine ambalaže po materijalu za razdoblje koje se prijavljuje.',
        'Provjeriti aktualne rokove, obrasce i uvjete iz službenog izvora prije podnošenja.'
      ]
    }));
    return {
      reportId:'EPR-'+Date.now().toString(36).toUpperCase(),
      generatedAt:new Date().toISOString(),
      client:{name:data.name||'',email:data.email||'',webshop:data.webshop||'',address:data.address||'',oib:data.oib||'',phone:data.phone||''},
      scope:{countries:selected.map(x=>markets[x].market),volume,packaging,notes:data.scope||''},
      markets:ms,
      exclusions:['pravna usluga ili formalno pravno mišljenje','registracija ili prijava u ime klijenta','jamstvo regulatorne usklađenosti','konačan obračun naknada bez stvarnih podataka o količinama i statusu subjekta']
    };
  }
  return {buildDraft, markets};
})();
