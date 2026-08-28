
window.EPR_REPORT_ENGINE = {
  version: "1.0",
  sources: {
    germany: {
      name:"Njemačka — ZSVR / LUCID",
      url:"https://www.verpackungsregister.org/en/ppwr/mail-order-companies-online-retailers",
      facts:[
        "Online retailers should assess whether they are producers under the PPWR.",
        "Producers subject to German packaging obligations must register with LUCID.",
        "Packaging subject to system participation requires a system participation agreement and data reporting.",
        "Packaging volumes should be tracked by material type, weight and reporting period."
      ]
    },
    austria: {
      name:"Austrija — službeni izvori",
      url:"https://www.usp.gv.at/en/umwelt-verkehr/abfall-ressourcenmanagement/verpackungen.html",
      facts:["Provjeriti nacionalni EPR režim, ulogu stranog prodavatelja, predstavnika i izvještavanje."]
    },
    slovenia: {
      name:"Slovenija — GOV.SI",
      url:"https://www.gov.si/en/topics/packaging-and-packaging-waste/",
      facts:["Provjeriti nacionalne obveze za prekograničnu prodaju i ambalažu."]
    },
    italy: {
      name:"Italija — CONAI",
      url:"https://www.conai.org/en/companies/services-for-managing-consortium-obligations-and-business-opportunities/epr-fee/",
      facts:["Ambalaža i ambalažni materijali stavljeni na talijansko tržište mogu biti predmet CONAI EPR doprinosa."]
    },
    croatia: {
      name:"Hrvatska — FZOEU",
      url:"https://www.fzoeu.hr/",
      facts:["Za domaće obveze treba provjeriti važeći hrvatski sustav i relevantne registre."]
    }
  },
  buildDraft(data){
    const countries=(data.countries||[]).map(x=>x.toLowerCase());
    const map=[];
    for(const c of countries){
      let key=c.includes("njema")?"germany":c.includes("austr")?"austria":c.includes("sloven")?"slovenia":c.includes("ital")?"italy":c.includes("hrvat")?"croatia":null;
      if(!key) continue;
      map.push({market:c,source:this.sources[key]});
    }
    return {
      reportId:"EPR-"+Date.now().toString().slice(-7),
      generatedAt:new Date().toISOString(),
      status:"DRAFT — requires human review before delivery",
      client:{email:data.email||"", webshop:data.webshop||"", name:data.name||"", address:data.address||"", oib:data.oib||""},
      scope:{countries:data.countries||[], volume:data.volume||"", packaging:data.packaging||[]},
      markets:map,
      disclaimer:"Informativni izvještaj. Ne predstavlja pravno mišljenje niti jamči konačnu regulatornu kvalifikaciju. Prije provedbe treba provjeriti aktualne službene izvore."
    };
  }
};
