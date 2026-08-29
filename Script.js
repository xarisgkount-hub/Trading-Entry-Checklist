const checkboxes = document.querySelectorAll('.check-item');
const submitBtn = document.getElementById('submitBtn');
const tradeForm = document.getElementById('tradeForm');
const journalList = document.getElementById('journalList');

let trades = JSON.parse(localStorage.getItem('trading_journal')) || [];

checkboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    const allChecked = Array.from(checkboxes).every(c => c.checked);
    submitBtn.disabled = !allChecked;
    if (allChecked) {
      submitBtn.classList.add('active');
    } else {
      submitBtn.classList.remove('active');
    }
  });
});

tradeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newTrade = {
    asset: document.getElementById('asset').value.toUpperCase(),
    direction: document.getElementById('direction').value,
    pnl: parseFloat(document.getElementById('pnl').value),
    outcome: document.getElementById('outcome').value,
    date: new Date().toLocaleDateString()
  };

  trades.push(newTrade);
  localStorage.setItem('trading_journal', JSON.stringify(trades));
  
  tradeForm.reset();
  checkboxes.forEach(c => c.checked = false);
  submitBtn.disabled = true;
  submitBtn.classList.remove('active');

  renderJournal();
});

function renderJournal() {
  journalList.innerHTML = '';
  let wins = 0;
  let totalPnl = 0;

  trades.forEach((t) => {
    if (t.outcome === 'WIN') wins++;
    totalPnl += t.pnl;

    const li = document.createElement('li');
    li.innerHTML = `<span>${t.date} - ${t.asset} (${t.direction})</span> <strong class="${t.outcome}">${t.pnl >= 0 ? '+' : ''}${t.pnl} (${t.outcome})</strong>`;
    journalList.appendChild(li);
  });

  const total = trades.length;
  const winRateVal = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;

  document.getElementById('totalTrades').textContent = total;
  document.getElementById('winRate').textContent = `${winRateVal}%`;
  document.getElementById('totalPnl').textContent = `${totalPnl.toFixed(2)}`;
}

renderJournal();

