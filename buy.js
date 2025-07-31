
  function toggleBuySubmenu() {
  const submenu = document.getElementById('buySubmenu');
  submenu.classList.toggle('hidden');
}

  const buyData = JSON.parse(localStorage.getItem('buyData')) || [];

  function calculateBuyTotal() {
    const waxQty = +document.getElementById('waxQtyb').value || 0;
    const waxRate = +document.getElementById('waxRateb').value || 0;
    const stearicQty = +document.getElementById('stearicQty').value || 0;
    const stearicRate = +document.getElementById('stearicRate').value || 0;
    const atoz = +document.getElementById('atoz').value || 0;
    const previousDue = +document.getElementById('previousDue').value || 0;
    const payment = +document.getElementById('paymentb').value || 0;

    const waxAmount = waxQty * waxRate;
    const stearicAmount = stearicQty * stearicRate;
    const total = waxAmount + stearicAmount + atoz;
    const totalDue = total + previousDue - payment;

    document.getElementById('waxAmountb').value = waxAmount;
    document.getElementById('stearicAmount').value = stearicAmount;
    document.getElementById('totalb').value = total;
    document.getElementById('totalDueb').value = totalDue;
  }



  
 async function saveBuyData() {
  const form = document.getElementById('buyForm');
  const formData = new FormData(form);
  const entry = {};
  formData.forEach((val, key) => entry[key] = val);

  try {
    await db.collection('buyData').add(entry);
    form.reset();
    closeModal('buy');
    renderBuyTable();
  } catch (error) {
    alert('Error saving data: ' + error.message);
  }
}

  async function renderBuyTable() {
  const table = document.getElementById('buyDataTable');
  table.innerHTML = '';

  try {
    const snapshot = await db.collection('buyData').get();
    if (snapshot.empty) {
      table.innerHTML = '<tr><td colspan="9" class="text-center p-2">No buy data found.</td></tr>';
      return;
    }

    snapshot.forEach(doc => {
      const entry = doc.data();
      const id = doc.id;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${entry.buyDate || ''}</td>
        <td class="p-2">${entry.waxQty || ''}</td>
        <td class="p-2">${entry.stearicQty || ''}</td>
        <td class="p-2">${entry.atoz || ''}</td>
        <td class="p-2">${entry.total || ''}</td>
        <td class="p-2">${entry.payment || ''}</td>
        <td class="p-2">${entry.totalDue || ''}</td>
        <td class="p-2">${entry.bank || ''}</td>
        <td class="p-2 text-center">
          <button onclick="deleteBuy('${id}')" class="text-red-400 hover:text-red-300">🗑️</button>
        </td>
      `;
      table.appendChild(row);
    });

  } catch (error) {
    table.innerHTML = '<tr><td colspan="9" class="text-center text-red-500 p-2">Error loading data.</td></tr>';
  }
}





async function deleteBuy(id) {
  if (!confirm('Are you sure you want to delete this entry?')) return;

  try {
    await db.collection('buyData').doc(id).delete();
    renderBuyTable();
  } catch (error) {
    alert('Error deleting data: ' + error.message);
  }
}

  function openModal(id) {
    document.getElementById(id + 'Modal').classList.remove('hidden');
  }
  function closeModal(id) {
    document.getElementById(id + 'Modal').classList.add('hidden');
  }


  
async function showBuyReport() {
  const reportDiv = document.getElementById('buyReportContent');

  try {
    const snapshot = await db.collection('buyData').get();

    if (snapshot.empty) {
      reportDiv.innerHTML = '<p class="text-red-400">No buy data available.</p>';
      openModal('buyReport');
      return;
    }

    let totalWax = 0;
    let totalStearic = 0;
    let totalAmount = 0;
    let totalPayment = 0;
    let currentDue = 0;
    const bankTotals = {};

    snapshot.forEach(doc => {
      const entry = doc.data();

      const waxQty = parseFloat(entry.waxQty) || 0;
      const stearicQty = parseFloat(entry.stearicQty) || 0;
      const amount = parseFloat(entry.total) || 0;
      const payment = parseFloat(entry.payment) || 0;
      const bank = entry.bank || "Unknown";

      totalWax += waxQty;
      totalStearic += stearicQty;
      totalAmount += amount;
      totalPayment += payment;
      currentDue += (amount - payment);

      if (!bankTotals[bank]) {
        bankTotals[bank] = 0;
      }
      bankTotals[bank] += payment;
    });

    let bankHtml = Object.entries(bankTotals).map(([bank, amount]) => {
      return `<li class="flex justify-between py-1 border-b border-gray-700">
        <span>🏦 ${bank}</span>
        <span class="text-yellow-400 font-semibold">${amount.toFixed(2)}৳</span>
      </li>`;
    }).join('');

    reportDiv.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-yellow-400 font-semibold mb-2">🧾 Summary</h3>
          <ul class="space-y-1 text-gray-300">
            <li class="flex justify-between"><span>📋 Total Entries:</span> <span class="font-semibold">${snapshot.size}</span></li>
            <li class="flex justify-between"><span>🧊 Total Wax:</span> <span class="font-semibold">${totalWax.toFixed(2)} kg</span></li>
            <li class="flex justify-between"><span>🧈 Total Stearic:</span> <span class="font-semibold">${totalStearic.toFixed(2)} kg</span></li>
          </ul>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-yellow-400 font-semibold mb-2">💵 Finance</h3>
          <ul class="space-y-1 text-gray-300">
            <li class="flex justify-between"><span>💰 Total Purchase:</span> <span class="font-semibold">${totalAmount.toFixed(2)}৳</span></li>
            <li class="flex justify-between"><span>🪙 Total Payment:</span> <span class="font-semibold">${totalPayment.toFixed(2)}৳</span></li>
            <li class="flex justify-between"><span>📉 Current Due:</span> <span class="text-red-400 font-semibold">${currentDue.toFixed(2)}৳</span></li>
          </ul>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg shadow col-span-1 md:col-span-2">
          <h3 class="text-yellow-400 font-semibold mb-2">🏦 Bank-wise Payment</h3>
          <ul class="text-gray-300 divide-y divide-gray-700">
            ${bankHtml || '<li class="py-1">No bank data</li>'}
          </ul>
        </div>
      </div>
    `;

    openModal('buyReport');

  } catch (error) {
    reportDiv.innerHTML = `<p class="text-red-500">Error loading report: ${error.message}</p>`;
    openModal('buyReport');
  }
}




  // render on load if data exists
  document.addEventListener('DOMContentLoaded', renderBuyTable);