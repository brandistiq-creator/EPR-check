(() => {
  try {
    const raw = sessionStorage.getItem('eprPackagingSummary');
    if (!raw) return;
    const data = JSON.parse(raw);
    const form = document.querySelector('#leadform');
    if (!form) return;
    const ensure = (name, id) => {
      let el = form.querySelector(`[name="${name}"]`) || (id ? document.getElementById(id) : null);
      if (!el) {
        el = document.createElement('input'); el.type='hidden'; el.name=name; form.appendChild(el);
      }
      return el;
    };
    const totals = data.totals || {};
    const countries = Array.isArray(data.countries) ? data.countries : [];
    const totalKg = Number(data.totalKg || 0);
    ensure('packaging-markets','packagingMarkets').value = countries.join(', ');
    ensure('packaging-total-kg','packagingTotalKg').value = totalKg ? totalKg.toFixed(3) : '';
    ensure('packaging-totals','packagingTotals').value = Object.entries(totals).map(([m,kg]) => `${m}: ${Number(kg).toFixed(3)} kg`).join(' | ');
    ensure('packaging-calculator-used','packagingCalculatorUsed').value = 'Da';
    ensure('packaging-calculator-generated-at','packagingCalculatorGeneratedAt').value = data.generatedAt || '';
    const summary = document.querySelector('#packagingCalculatorSummary');
    if (summary && totalKg) {
      summary.innerHTML = `<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#315efb;margin-bottom:6px">Podaci iz EPR Packaging Calculatora</div><div style="font-size:13px;line-height:1.6;color:#526174"><strong>${totalKg.toFixed(3)} kg</strong> ukupno${countries.length ? ` · ${countries.join(', ')}` : ''}<br>${Object.entries(totals).map(([m,kg])=>`${m}: ${Number(kg).toFixed(3)} kg`).join(' · ')}</div>`;
      summary.style.display='block';
    }
    const scope = document.querySelector('#scopeField');
    if (scope && !scope.dataset.userEdited && totalKg) {
      const block = [
        countries.length ? `Tržišta iz kalkulatora: ${countries.join(', ')}` : '',
        `Procijenjena ukupna ambalaža: ${totalKg.toFixed(3)} kg`,
        Object.entries(totals).length ? `Po materijalu: ${Object.entries(totals).map(([m,kg])=>`${m} ${Number(kg).toFixed(3)} kg`).join(', ')}` : ''
      ].filter(Boolean).join('\n');
      scope.value = `${block}\n\nDodatne informacije: `;
    }
  } catch (e) { console.warn('EPR Packaging Calculator integration:', e); }
})();
