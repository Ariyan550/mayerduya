
const firebaseConfig = {
  apiKey: "AIzaSyAQStIKIHdMzIzvwI7AxkCNjboI72-kHUA",
  authDomain: "sellgit.firebaseapp.com",
  projectId: "sellgit",
  storageBucket: "sellgit.firebasestorage.app",
  messagingSenderId: "202762896068",
  appId: "1:202762896068:web:c1b7d2afd74856e99c3f91",
  measurementId: "G-C1QG3DML39"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();




    // Data keys for localStorage
    const LS_KEYS = {
      wax: 'waxSales',
      chalk: 'chalkSales',
      shops: 'shops',
    };

    // Pagination settings
    const PAGE_SIZE = 10;

    // State variables
    let waxData = [];
    let editMode = false;
    let editShopIndex = -1;
    let chalkData = [];
    let shops = [];




    // Pagination indexes
    let waxPage = 1;
    let chalkPage = 1;

    // Filter dates
    let waxFilter = '';
    let chalkFilter = '';



//chalk sije

function enableChalkSizeSelect() {
  const sizeInput = document.getElementById('chalkSize');
  if (sizeInput && !sizeInput.tomselect) {
    new TomSelect(sizeInput, {
      create: false,
      sortField: { field: 'text', direction: 'asc' },
      options: [
        { value: 'Small', text: 'Small' },
        { value: 'Big', text: 'Big' },
      ],
      placeholder: 'Select Size'
    });
  }
}

function toggleSummarySubmenu() {
  document.getElementById('summarySubmenu').classList.toggle('hidden');
}



    // Modal open function
   function openModal(type) {
  if (type === 'wax') {
    document.getElementById('waxModal').classList.remove('hidden');
    setTimeout(() => {
      resetForm('wax');
      populateShopOptions('waxShopSelect');
      window.nextDocToUpdate = null;
    }, 50); // ⏱️ ৫০ মিলিসেকেন্ড delay, যাতে modal DOM fully load হয়
  }

  else if (type === 'chalk') {
    document.getElementById('chalkModal').classList.remove('hidden');
    setTimeout(() => {
      resetForm('chalk');
      enableChalkSizeSelect();
      populateShopOptions('chalkShopSelect');
      window.nextDocToUpdate = null;
    }, 50);
  }

  else if (type === 'shop') {
    document.getElementById('shopModal').classList.remove('hidden');
    if (!editMode) {
      resetShopForm(); // ✅ শুধু নতুন Shop Add করলে reset হবে
    }
    renderShopList();
  }

  else if (type === 'shopList') {
    document.getElementById('shopListModal').classList.remove('hidden');
    renderShopListTable(); // ✅ Shop List Table
  }else if (type === 'chalkSummary') {
  document.getElementById('chalkSummaryModal').classList.remove('hidden');
  renderChalkSizeSummaryModal(); // ✅ ফাংশন কল করবো
}

}


// tostify
function showToast(message, type = 'success') {
  let backgroundColor;

  if (type === 'success') backgroundColor = "#22c55e";     // green
  else if (type === 'error') backgroundColor = "#ef4444";  // red
  else if (type === 'info') backgroundColor = "#facc15";   // yellow
  else backgroundColor = "#64748b"; // default (gray)

  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    backgroundColor,
    stopOnFocus: true,
  }).showToast();
}




//tomselect


function enableTomSelect(id) {
  const el = document.getElementById(id);
  if (el && !el.tomselect) {
    new TomSelect(el, {
      create: true,
      sortField: {
        field: 'text',
        direction: 'asc'
      },
      placeholder: 'Search or select shop...'
    });
  }
}


//render chalk sije

function renderChalkSizeSummaryModal() {
  const summary = {};

  chalkData.forEach(item => {
    const size = item.size || 'Unknown';
    if (!summary[size]) {
      summary[size] = { qty: 0, profit: 0 };
    }
    summary[size].qty += item.qty;
    summary[size].profit += item.profit;
  });

  let html = `
    <table class="w-full border border-gray-600 text-sm text-center">
      <thead class="bg-gray-700 text-gray-300">
        <tr>
          <th class="p-2 border border-gray-600">Size</th>
          <th class="p-2 border border-gray-600">Total Qty</th>
          <th class="p-2 border border-gray-600">Total Profit (৳)</th>
        </tr>
      </thead>
      <tbody class="text-gray-100">
  `;

  Object.entries(summary).forEach(([size, data]) => {
    html += `
      <tr class="border-b border-gray-700">
        <td class="p-2 border border-gray-600">${size}</td>
        <td class="p-2 border border-gray-600">${data.qty}</td>
        <td class="p-2 border border-gray-600">${data.profit.toFixed(2)}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;

  document.getElementById('chalkSummaryContent').innerHTML = html;
}






// rander shop list table

function renderShopListTable() {
  const tbody = document.getElementById('shopListTableBody');
  tbody.innerHTML = '';
  if (shops.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-400 py-4">No shops available.</td></tr>';
    return;
  }

  shops.forEach((shop, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="border border-gray-600 p-2">${index + 1}</td>
      <td class="border border-gray-600 p-2">${shop.name}</td>
      <td class="border border-gray-600 p-2">${shop.address || '-'}</td>
      <td class="border border-gray-600 p-2">${shop.mobile || '-'}</td>
      <td class="border border-gray-600 p-2 text-right text-yellow-400 font-semibold">
      ৳ ${getTotalDueByShop(shop.name).toFixed(2)}
    </td>
      <td class="border border-gray-600 p-2 text-center">
      <button onclick="editShopById('${shop.id}')" class="text-yellow-400 hover:text-yellow-200 material-icons">edit</button>
      <button onclick="deleteShopById('${shop.id}')" class="text-red-500 hover:text-red-300 material-icons">delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });


document.getElementById('shopSearchInput').value = '';


}




    // Modal close function
    function closeModal(type) {
      if (type === 'wax') {
        document.getElementById('waxModal').classList.add('hidden');
      } else if (type === 'chalk') {
        document.getElementById('chalkModal').classList.add('hidden');
      } else if (type === 'shop') {
        document.getElementById('shopModal').classList.add('hidden');
      }else if (type === 'shopList') {
  document.getElementById('shopListModal').classList.add('hidden');
}else if (type === 'payment') {
  document.getElementById('paymentModal').classList.add('hidden');
}else if (type === 'history') {
  document.getElementById('historyModal').classList.add('hidden');
}else if (type === 'invoice') {
  document.getElementById('invoiceModal').classList.add('hidden');
}else if (type === 'chalkSummary') {
  document.getElementById('chalkSummaryModal').classList.add('hidden');
}



    }

    // Reset forms
    function resetForm(type) {
      if (type === 'wax') {
        document.getElementById('waxDate').value = '';
        document.getElementById('waxShop').value = '';
        document.getElementById('waxQty').value = '';
        document.getElementById('waxRate').value = '';
        document.getElementById('waxAmount').value = '';
        document.getElementById('waxPayment').value = '0';
        document.getElementById('waxDue').value = '';
        document.getElementById('waxProfitInput').value = '';
      } else if (type === 'chalk') {
        document.getElementById('chalkDate').value = '';
        document.getElementById('chalkShop').value = '';
        document.getElementById('chalkSize').value = '';
        document.getElementById('chalkQty').value = '';
        document.getElementById('chalkRate').value = '';
        document.getElementById('chalkAmount').value = '';
        document.getElementById('chalkPayment').value = '0';
        document.getElementById('chalkDue').value = '';
        document.getElementById('chalkProfitInput').value = '';
      }
    }

    // Reset shop form
   function resetShopForm() {
  document.getElementById('shopNameInput').value = '';
  document.getElementById('shopAddressInput').value = '';
  document.getElementById('shopMobileInput').value = '';
  document.getElementById('shopSubmitBtn').textContent = 'Add Shop';
  editMode = false;
  editShopIndex = -1;
}


    // Load data from localStorage
    async function loadData() {
     try {
    // 🔹 Wax Sales
    const waxSnap = await db.collection("waxSales").get();
    waxData = waxSnap.docs.map(doc => doc.data());
    localStorage.setItem(LS_KEYS.wax, JSON.stringify(waxData));

    // 🔹 Chalk Sales
    const chalkSnap = await db.collection("chalkSales").get();
    chalkData = chalkSnap.docs.map(doc => doc.data());
    localStorage.setItem(LS_KEYS.chalk, JSON.stringify(chalkData));

    // 🔹 Shops
    const shopSnap = await db.collection("shops").get();
    shops = shopSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));


    localStorage.setItem(LS_KEYS.shops, JSON.stringify(shops));

    // 🔁 রেন্ডার ফাংশনগুলো কল করুন
    renderTable('wax');
    renderTable('chalk');
    renderDueList('wax');
    renderDueList('chalk');
    renderShopList();
    renderMonthlyChart();
  } catch (error) {
    console.error("Error loading data from Firebase:", error);
    showToast("Firebase থেকে ডেটা লোড করা যায়নি।");
  }
}

    // Save data to localStorage
    function saveData(type) {
      if (type === 'wax') {
        localStorage.setItem(LS_KEYS.wax, JSON.stringify(waxData));
      } else if (type === 'chalk') {
        localStorage.setItem(LS_KEYS.chalk, JSON.stringify(chalkData));
      } else if (type === 'shops') {
        localStorage.setItem(LS_KEYS.shops, JSON.stringify(shops));
      }
    }


    
   

 // Populate shop options in form select dropdown
  function populateShopOptions(selectId) {
  const select = document.getElementById(selectId);
  if (!select) {
    console.warn(`⚠️ Shop select element not found: ${selectId}`);
    return;
  }

  select.innerHTML = '<option value="" disabled selected>-- Select Shop --</option>';
  shops.forEach((shop) => {
    const opt = document.createElement('option');
    opt.value = shop.name;
    opt.textContent = shop.name;
    select.appendChild(opt);
  });

enableTomSelect(selectId); // ✅ এটা যোগ করো


}




//shop manage submenu
function toggleShopSubmenu() {
  document.getElementById('shopSubmenu').classList.toggle('hidden');
}



function resetForm(type) {
  const fields = ['Date', 'Qty', 'Rate', 'Amount', 'Payment', 'Due', 'ProfitInput', 'Size'];

  fields.forEach(field => {
    const el = document.getElementById(type + field);
    if (el) el.value = '';
  });

  const shopSelect = document.getElementById(type + 'ShopSelect');
  if (shopSelect?.tomselect) {
    shopSelect.tomselect.clear(); // TomSelect থাকলে clear
  } else if (shopSelect) {
    shopSelect.value = '';
  }
}







    // Submit wax or chalk form
  function submitForm(type) {
  const isWax = type === 'wax';

  // ✅ Tom Select থেকে shop ID নেওয়ার অংশ
let shopSelectId = type === 'wax' ? '#waxShopSelect' : '#chalkShopSelect';
let shopId = document.querySelector(shopSelectId)?.tomselect?.getValue();
let shopName = document.querySelector(shopSelectId)?.tomselect?.getItem(shopId)?.textContent;


  const formData = {
    date: document.getElementById(type + 'Date').value,
   shop: shopName,
    qty: parseFloat(document.getElementById(type + 'Qty').value),
    rate: parseFloat(document.getElementById(type + 'Rate').value),
    amount: parseFloat(document.getElementById(type + 'Amount').value),
    payment: parseFloat(document.getElementById(type + 'Payment').value),
    due: parseFloat(document.getElementById(type + 'Due').value),
    profit: parseFloat(document.getElementById(type + 'ProfitInput').value),
  };

  if (!isWax) {
    formData.size = document.getElementById('chalkSize').value.trim();
  }

  // ✅ Validation
  if (
    !formData.date || !formData.shop || isNaN(formData.qty) || isNaN(formData.rate) ||
    isNaN(formData.amount) || isNaN(formData.payment) || isNaN(formData.due) || isNaN(formData.profit) ||
    (!isWax && !formData.size)
  ) {
    showToast('❌ Please fill all fields correctly', 'error');
    return;
  }

  const collection = db.collection(type + 'Sales');

  // 🔁 Update existing document
  if (window.nextDocToUpdate) {
    const docId = window.nextDocToUpdate;
    collection.doc(docId).update(formData)
      .then(() => {
        showToast("✅ Entry updated");
        if (isWax) {
          waxData.push(formData);
          saveData('wax');
          renderTable('wax');
          renderDueList('wax');
          closeModal('wax');
        } else {
          chalkData.push(formData);
          saveData('chalk');
          renderTable('chalk');
          renderDueList('chalk');
          closeModal('chalk');
        }
        window.nextDocToUpdate = null;
      })
      .catch((err) => {
        showToast("❌ Update failed", "error");
        console.error(err);
      });
  } else {
    // ➕ Add new entry
    collection.add(formData)
      .then(() => {
        showToast("✅ Entry saved");
          resetForm(type); // ✅ ফর্ম ক্লিয়ার
        if (isWax) {
          waxData.push(formData);
          saveData('wax');
          renderTable('wax');
          renderDueList('wax');
          closeModal('wax');
        } else {
          chalkData.push(formData);
          saveData('chalk');
          renderTable('chalk');
          renderDueList('chalk');
          closeModal('chalk');
        }
      });
  }
}



    // Calculate Amount and Due for forms
    function calcAmountDue(type) {
      if (type === 'wax') {
        const qty = parseFloat(document.getElementById('waxQty').value) || 0;
        const rate = parseFloat(document.getElementById('waxRate').value) || 0;
        const amount = qty * rate;
        document.getElementById('waxAmount').value = amount.toFixed(2);
        // recalc due
        calcDue('wax');
      } else if (type === 'chalk') {
        const qty = parseFloat(document.getElementById('chalkQty').value) || 0;
        const rate = parseFloat(document.getElementById('chalkRate').value) || 0;
        const amount = qty * rate;
        document.getElementById('chalkAmount').value = amount.toFixed(2);
        // recalc due
        calcDue('chalk');
      }
    }

    // Calculate Due based on Amount and Payment
    function calcDue(type) {
      if (type === 'wax') {
        const amount = parseFloat(document.getElementById('waxAmount').value) || 0;
        const payment = parseFloat(document.getElementById('waxPayment').value) || 0;
        let due = amount - payment;
        if (due < 0) due = 0;
        document.getElementById('waxDue').value = due.toFixed(2);
      } else if (type === 'chalk') {
        const amount = parseFloat(document.getElementById('chalkAmount').value) || 0;
        const payment = parseFloat(document.getElementById('chalkPayment').value) || 0;
        let due = amount - payment;
        if (due < 0) due = 0;
        document.getElementById('chalkDue').value = due.toFixed(2);
      }
    }

    // Render Wax or Chalk table with pagination & filtering
    function renderTable(type) {
      let data = type === 'wax' ? waxData : chalkData;
      const tbody = document.getElementById(type + 'Table').querySelector('tbody');

      // filter by date if set
      const filterDate = type === 'wax' ? waxFilter : chalkFilter;
      if (filterDate) {
        data = data.filter((d) => d.date === filterDate);
      }

      // Pagination
      const page = type === 'wax' ? waxPage : chalkPage;
      const totalPages = Math.ceil(data.length / PAGE_SIZE);
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const pageData = data.slice(start, end);

      // Build table rows
      tbody.innerHTML = '';
      pageData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-700';

        if (type === 'wax') {
          tr.innerHTML = `
            <td class="border border-gray-600 px-2 py-1">${item.date}</td>
            <td class="border border-gray-600 px-2 py-1">${item.shop}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.qty}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.rate.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.amount.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.payment.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.due.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.profit.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-center">
              <button onclick="editEntry('wax', ${start + idx})" class="text-yellow-400 hover:text-yellow-300 material-icons">edit</button>
            </td>
            <td class="border border-gray-600 px-2 py-1 text-center">
              <button onclick="deleteEntry('wax', ${start + idx})" class="text-red-500 hover:text-red-400 material-icons">delete</button>
            </td>
          `;
        } else {
          tr.innerHTML = `
            <td class="border border-gray-600 px-2 py-1">${item.date}</td>
            <td class="border border-gray-600 px-2 py-1">${item.shop}</td>
            <td class="border border-gray-600 px-2 py-1">${item.size}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.qty}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.rate.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.amount.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.payment.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.due.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-right">${item.profit.toFixed(2)}</td>
            <td class="border border-gray-600 px-2 py-1 text-center">
              <button onclick="editEntry('chalk', ${start + idx})" class="text-yellow-400 hover:text-yellow-300 material-icons">edit</button>
            </td>
            <td class="border border-gray-600 px-2 py-1 text-center">
              <button onclick="deleteEntry('chalk', ${start + idx})" class="text-red-500 hover:text-red-400 material-icons">delete</button>
            </td>
          `;
        }
        tbody.appendChild(tr);
      });

      // Pagination buttons
      renderPagination(type, totalPages);
      // Update totals
      updateTotals(type, data);
    }

    // Render pagination buttons
    function renderPagination(type, totalPages) {
      const container = document.getElementById(type + 'Pagination');
      container.innerHTML = '';
      if (totalPages <= 1) return;

      const page = type === 'wax' ? waxPage : chalkPage;

      // Previous button
      const prevBtn = document.createElement('button');
      prevBtn.textContent = 'Prev';
      prevBtn.disabled = page === 1;
      prevBtn.className = 'px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50';
      prevBtn.onclick = () => {
        if (type === 'wax') waxPage--;
        else chalkPage--;
        renderTable(type);
      };
      container.appendChild(prevBtn);

      // Page numbers
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className =
          'px-3 py-1 rounded ' +
          (i === page ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600');
        btn.onclick = () => {
          if (type === 'wax') waxPage = i;
          else chalkPage = i;
          renderTable(type);
        };
        container.appendChild(btn);
      }

      // Next button
      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Next';
      nextBtn.disabled = page === totalPages;
      nextBtn.className = 'px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50';
      nextBtn.onclick = () => {
        if (type === 'wax') waxPage++;
        else chalkPage++;
        renderTable(type);
      };
      container.appendChild(nextBtn);
    }

    // Filter data by date
    function filterData(type) {
      if (type === 'wax') {
        waxFilter = document.getElementById('waxFilterDate').value;
        waxPage = 1;
        renderTable('wax');
        renderDueList('wax');
      } else {
        chalkFilter = document.getElementById('chalkFilterDate').value;
        chalkPage = 1;
        renderTable('chalk');
        renderDueList('chalk');
      }
    }

    // Update totals and total due display
    function updateTotals(type, data) {
      let totalQty = 0;
      let totalAmt = 0;
      let totalProfit = 0;
      let totalDue = 0;
      data.forEach((d) => {
        totalQty += d.qty;
        totalAmt += d.amount;
        totalProfit += d.profit;
        totalDue += d.due;
      });
      if (type === 'wax') {
        document.getElementById('waxTotalQty').textContent = totalQty.toFixed(2);
        document.getElementById('waxTotalAmt').textContent = totalAmt.toFixed(2);
        document.getElementById('waxProfit').textContent = totalProfit.toFixed(2);
        document.getElementById('waxTotalDue').textContent = totalDue.toFixed(2);
      } else {
        document.getElementById('chalkTotalQty').textContent = totalQty.toFixed(2);
        document.getElementById('chalkTotalAmt').textContent = totalAmt.toFixed(2);
        document.getElementById('chalkProfit').textContent = totalProfit.toFixed(2);
        document.getElementById('chalkTotalDue').textContent = totalDue.toFixed(2);
      }
    }

    // Render Due List with Complete button
    function renderDueList(type) {
      const container = document.getElementById(type + 'DueList');
      const data = type === 'wax' ? waxData : chalkData;
      const filterDate = type === 'wax' ? waxFilter : chalkFilter;

      // Filter due > 0 and date filter if set
      let dueItems = data.filter(d => d.due > 0);
      if (filterDate) {
        dueItems = dueItems.filter(d => d.date === filterDate);
      }

      if (dueItems.length === 0) {
        container.innerHTML = '<p class="text-gray-400">No due entries.</p>';
        return;
      }

      let html = `<table class="w-full text-sm text-left text-gray-100">
      <thead>
        <tr class="border-b border-gray-600">
          <th class="px-2 py-1">Date</th>
          <th class="px-2 py-1">Shop</th>
          ${type === 'chalk' ? '<th class="px-2 py-1">Size</th>' : ''}
          <th class="px-2 py-1 text-right">Due Amount</th>
          <th class="px-2 py-1 text-center">Action</th>
        </tr>
      </thead>
      <tbody>`;

      dueItems.forEach((item, idx) => {
        html += `<tr class="border-b border-gray-700 hover:bg-gray-700">
          <td class="px-2 py-1">${item.date}</td>
          <td class="px-2 py-1">${item.shop}</td>
          ${type === 'chalk' ? `<td class="px-2 py-1">${item.size}</td>` : ''}
          <td class="px-2 py-1 text-right">${item.due.toFixed(2)}</td>
          <td class="px-2 py-1 text-center">
            <button
              onclick="completeDue('${type}', ${findIndexInData(type, item)})"
              class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-semibold"
            >
              Complete
            </button>
            <button
  onclick="openPaymentModal('${type}', ${findIndexInData(type, item)})"
  class="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-semibold"
>
  Payment
</button>
<button
  onclick="viewPaymentHistory('${type}', ${findIndexInData(type, item)})"
  class="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm font-semibold ml-2"
>
  History
</button>


          </td>
        </tr>`;
      });

      html += '</tbody></table>';
      container.innerHTML = html;
    }

    // Find index of item in original data (needed for completing due)
    function findIndexInData(type, item) {
      let arr = type === 'wax' ? waxData : chalkData;
      for (let i = 0; i < arr.length; i++) {
        // Simple matching by all fields (date + shop + qty + rate + amount + profit)
        if (
          arr[i].date === item.date &&
          arr[i].shop === item.shop &&
          arr[i].qty === item.qty &&
          arr[i].rate === item.rate &&
          arr[i].amount === item.amount &&
          arr[i].profit === item.profit
        ) {
          if (type === 'chalk') {
            if (arr[i].size === item.size) return i;
          } else {
            return i;
          }
        }
      }
      return -1;
    }

    // Complete due action (remove due by marking due=0 and payment=amount)
   function completeDue(type, index) {
  if (index === -1) return;
  let data = type === 'wax' ? waxData : chalkData;
  const item = data[index];

  // Update local data
  item.payment = item.amount;
  item.due = 0;

  // 🔥 Firebase Update
  db.collection(type + 'Sales')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const docData = doc.data();
        const isSame =
          docData.date === item.date &&
          docData.shop === item.shop &&
          docData.qty === item.qty &&
          docData.rate === item.rate &&
          docData.amount === item.amount &&
          docData.profit === item.profit &&
          (type === 'chalk' ? docData.size === item.size : true);

        if (isSame) {
          doc.ref.update({
            payment: item.amount,
            due: 0
          }).then(() => {
            showToast("Due Updated");
          });
        }
      });
    })
    .catch(err => {
      console.error("Firebase update error (due complete):", err);
    });

  // ✅ Save to localStorage
  saveData(type);
  renderTable(type);
  renderDueList(type);
}



    // Delete entry (wax or chalk)
    function deleteEntry(type, index) {
    if (!confirm('Are you sure you want to delete this entry?')) return;

  const data = type === 'wax' ? waxData : chalkData;
  const item = data[index];

  // 🔥 Firebase থেকে মুছে ফেলি
  db.collection(type + 'Sales')
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      if (
        data.date === item.date &&
        data.shop === item.shop &&
        data.amount === item.amount &&
        data.qty === item.qty &&
        data.rate === item.rate &&
        data.profit === item.profit &&
        (type === 'chalk' ? data.size === item.size : true)
      ) {
        doc.ref.delete(); // ✅ এখন নির্ভুল ডিলিট হবে
      }
    });
  });

  // ✅ LocalStorage থেকেও মুছে ফেলি
  data.splice(index, 1);
  saveData(type);
  renderTable(type);
  renderDueList(type);
}





    // Edit entry (open modal pre-filled)

   async function editEntry(type, index) {
  const data = type === 'wax' ? waxData : chalkData;
  const item = data[index];
  if (!item) return;

  let matchedDocId = null;

  // Find the matching doc in Firestore
  await db.collection(type + 'Sales').get().then(snapshot => {
    snapshot.forEach(doc => {
      const docData = doc.data();
      const isSame =
        docData.date === item.date &&
        docData.shop === item.shop &&
        docData.qty === item.qty &&
        docData.rate === item.rate &&
        docData.amount === item.amount &&
        docData.payment === item.payment &&
        docData.due === item.due &&
        docData.profit === item.profit &&
        (type === 'chalk' ? docData.size === item.size : true);

      if (isSame) {
        matchedDocId = doc.id;
      }
    });
  });

  if (!matchedDocId) {
    showToast("❌ Could not find original entry", "error");
    return;
  }

  // Pre-fill the form
  openModal(type);

  if (type === 'wax') {
    document.getElementById('waxDate').value = item.date;
    document.getElementById('waxShop').value = item.shop;
    document.getElementById('waxQty').value = item.qty;
    document.getElementById('waxRate').value = item.rate;
    document.getElementById('waxAmount').value = item.amount;
    document.getElementById('waxPayment').value = item.payment;
    document.getElementById('waxDue').value = item.due;
    document.getElementById('waxProfitInput').value = item.profit;
    waxData.splice(index, 1);
    saveData('wax');
  } else {
    document.getElementById('chalkDate').value = item.date;
    document.getElementById('chalkShop').value = item.shop;
    document.getElementById('chalkSize').value = item.size;
    document.getElementById('chalkQty').value = item.qty;
    document.getElementById('chalkRate').value = item.rate;
    document.getElementById('chalkAmount').value = item.amount;
    document.getElementById('chalkPayment').value = item.payment;
    document.getElementById('chalkDue').value = item.due;
    document.getElementById('chalkProfitInput').value = item.profit;
    chalkData.splice(index, 1);
    saveData('chalk');
  }

  // ✅ Call submitForm with doc ID
  window.nextDocToUpdate = matchedDocId;
}


    // Shop management
function addShop() {
  const name = document.getElementById('shopNameInput').value.trim();
  const address = document.getElementById('shopAddressInput').value.trim();
  const mobile = document.getElementById('shopMobileInput').value.trim();

  if (!name) {
    showToast('Shop name is required', 'error');
    return;
  }

  const shopData = { name, address, mobile };

  if (editMode && editShopIndex) {
    const shopId = editShopIndex;
    db.collection("shops").doc(shopId).update(shopData)
      .then(() => {
        const i = shops.findIndex(s => s.id === shopId);
        if (i !== -1) {
          shops[i] = { id: shopId, ...shopData };
        }
        saveData('shops');
        renderShopList();
        renderShopListTable();
        resetShopForm();
        closeModal('shop');
        showToast("✅ Shop updated");
        editMode = false;
        editShopIndex = '';
        loadShopsFromFirebase(); // 🔁 update করে reload করবো
      })
      .catch(err => {
        showToast("❌ Update failed", "error");
        console.error(err);
      });
  } else {
    db.collection("shops").add(shopData)
      .then((docRef) => {
        shops.push({ id: docRef.id, ...shopData });
        saveData('shops');
        renderShopList();
        renderShopListTable();
        resetShopForm();
        closeModal('shop');
        showToast("✅ Shop added");
        loadShopsFromFirebase(); // 🔁 update করে reload করবো
      });
  }
}





function renderShopList() {
  const waxSelect = document.getElementById('waxShopSelect');
  const chalkSelect = document.getElementById('chalkShopSelect');

  // Reset dropdown
  waxSelect.innerHTML = '<option value="">Select Shop</option>';
  chalkSelect.innerHTML = '<option value="">Select Shop</option>';

  // Load shop list into dropdown
  shops.forEach(shop => {
    const option = `<option value="${shop.id}">${shop.name}</option>`;
    waxSelect.insertAdjacentHTML('beforeend', option);
    chalkSelect.insertAdjacentHTML('beforeend', option);
  });

  // ✅ Make searchable with Tom Select
  if (!waxSelect.tomselect) {
    new TomSelect('#waxShopSelect', {
      create: false,
      placeholder: 'Search shop...',
    });
  }

  if (!chalkSelect.tomselect) {
    new TomSelect('#chalkShopSelect', {
      create: false,
      placeholder: 'Search shop...',
    });
  }
}




//filtershop list

function filterShopListTable() {
  const query = document.getElementById('shopSearchInput').value.toLowerCase();
  const tbody = document.getElementById('shopListTableBody');
  tbody.innerHTML = '';

  const filtered = shops.filter(shop =>
    shop.name.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-400 py-4">No matching shops found.</td></tr>';
    return;
  }

  filtered.forEach((shop, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="border border-gray-600 p-2">${index + 1}</td>
      <td class="border border-gray-600 p-2">${shop.name}</td>
      <td class="border border-gray-600 p-2">${shop.address || '-'}</td>
      <td class="border border-gray-600 p-2">${shop.mobile || '-'}</td>
      <td class="border border-gray-600 p-2 text-center">
        <button onclick="editShop(${index})" class="text-yellow-400 hover:text-yellow-200 material-icons">edit</button>
        <button onclick="deleteShop(${index})" class="text-red-500 hover:text-red-300 material-icons">delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}





    // delete shop
function deleteShopById(shopId) {
  if (!confirm('Are you sure you want to delete this shop?')) return;

  db.collection("shops").doc(shopId).delete()
    .then(() => {
      showToast("🗑️ Shop deleted", "info");
      loadShopsFromFirebase(); // 🔁 ডেটা আবার লোড করবে
    })
    .catch((error) => {
      console.error("❌ Failed to delete shop:", error);
      showToast("❌ Failed to delete shop", "error");
    });
}




//editshop
function editShopById(shopId) {
  const shop = shops.find(s => s.id === shopId);
  if (!shop) {
    showToast("❌ Shop not found", "error");
    return;
  }

  // Form fill
  document.getElementById('shopNameInput').value = shop.name;
  document.getElementById('shopAddressInput').value = shop.address || '';
  document.getElementById('shopMobileInput').value = shop.mobile || '';

  // Save the shopId for update
  editMode = true;
  editShopIndex = shopId;

  closeModal('shopList');
  openModal('shop');
  document.getElementById('shopSubmitBtn').textContent = 'Update Shop';
}


//reset function firebase delete

async function deleteAllFirestoreDocs(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();
  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}









    // Reset all data
async function resetAll() {
  if (!confirm("⚠️ Are you sure you want to reset all wax, chalk, and expense data?\nShop list will remain.")) return;

  // ✅ 1. Firestore থেকেও ডিলিট করি
  await deleteAllFirestoreDocs("waxSales");
  await deleteAllFirestoreDocs("chalkSales");

  // ✅ 2. LocalStorage থেকে ডিলিট করি
  localStorage.removeItem('waxSales');
  localStorage.removeItem('chalkSales');
  localStorage.removeItem('expenses');

  // ✅ 3. JS Variable Clear
  waxData = [];
  chalkData = [];
  expenses = [];

  // ✅ 4. Save খালি ডাটা বসাও
  saveData('wax');
  saveData('chalk');
  if (typeof saveExpenses === 'function') saveExpenses();

  // ✅ 5. Render আবার
  renderTable('wax');
  renderDueList('wax');
  renderTable('chalk');
  renderDueList('chalk');
  if (typeof renderExpenseTable === 'function') renderExpenseTable();

  showToast("✅ Wax, Chalk & Expense data cleared (Firebase + Local)", "success");
}


    // Initialize all
    function init() {
      loadData();
      renderTable('wax');
      renderTable('chalk');
      renderDueList('wax');
      renderDueList('chalk');
    }
    const expenseKey = 'expenses';
    let expenses = JSON.parse(localStorage.getItem(expenseKey)) || [];

    function addExpense() {
      const date = document.getElementById('expenseDate').value;
      const item = document.getElementById('expenseItem').value.trim();
      const amount = parseFloat(document.getElementById('expenseAmount').value);
      if (!date || !item || isNaN(amount)) return;
      expenses.push({ date, item, amount });
      saveExpenses();
      renderExpenses();
      document.getElementById('expenseDate').value = '';
      document.getElementById('expenseItem').value = '';
      document.getElementById('expenseAmount').value = '';
    }

    function deleteExpense(index) {
      if (!confirm('Delete this expense?')) return;
      expenses.splice(index, 1);
      saveExpenses();
      renderExpenses();
    }

    function saveExpenses() {
      localStorage.setItem(expenseKey, JSON.stringify(expenses));
    }

    function renderExpenses() {
      const tbody = document.getElementById('expenseTableBody');
      tbody.innerHTML = '';
      let total = 0;
      expenses.forEach((e, i) => {
        total += e.amount;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="border border-gray-600 px-2 py-1">${e.date}</td>
          <td class="border border-gray-600 px-2 py-1">${e.item}</td>
          <td class="border border-gray-600 px-2 py-1 text-right">${e.amount.toFixed(2)}</td>
          <td class="border border-gray-600 px-2 py-1 text-center">
            <button onclick="deleteExpense(${i})" class="text-red-500 hover:text-red-300">Delete</button>
          </td>`;
        tbody.appendChild(tr);
      });
      document.getElementById('totalExpense').textContent = total.toFixed(2);
      renderMonthlyChart();
    }




function openReport() {
  document.getElementById("reportModal").classList.remove("hidden");
  renderReportTables();
}

function closeReport() {
  document.getElementById("reportModal").classList.add("hidden");
}

function renderReportTables() {
  let html = '';

  // Wax Table
  html += `<div><h3 class="text-lg font-semibold mb-2 text-blue-400">Wax Sales</h3>
  <table class="w-full border border-gray-600 ">
    <thead class="bg-gray-700 text-gray-300">
      <tr><th>Date</th><th>Shop</th><th>Qty</th><th>Rate</th><th>Amount</th><th>Payment</th><th>Due</th><th>Profit</th></tr>
    </thead><tbody>`;
  waxData.forEach(w => {
    html += `<tr class="border-b border-gray-700 text-center text-gray-800"><td>${w.date}</td><td>${w.shop}</td><td>${w.qty}</td><td>${w.rate}</td><td>${w.amount}</td><td>${w.payment}</td><td>${w.due}</td><td>${w.profit}</td></tr>`;
  });
  html += `</tbody></table></div>`;

  // Chalk Table
  html += `<div><h3 class="text-lg font-semibold mb-2 text-green-400 mt-6">English Chalk Sales</h3>
  <table class="w-full border border-gray-600 ">
    <thead class="bg-gray-700 text-gray-300">
      <tr><th>Date</th><th>Shop</th><th>Size</th><th>Qty</th><th>Rate</th><th>Amount</th><th>Payment</th><th>Due</th><th>Profit</th></tr>
    </thead><tbody>`;
  chalkData.forEach(c => {
    html += `<tr class="border-b border-gray-700 text-center text-gray-800"><td>${c.date}</td><td>${c.shop}</td><td>${c.size}</td><td>${c.qty}</td><td>${c.rate}</td><td>${c.amount}</td><td>${c.payment}</td><td>${c.due}</td><td>${c.profit}</td></tr>`;
  });
  html += `</tbody></table></div>`;

  // Expense Table
  html += `<div><h3 class="text-lg font-semibold mb-2 text-yellow-400 mt-6">Expenses</h3>
  <table class="w-full border border-gray-600">
    <thead class="bg-gray-700 text-gray-300">
      <tr><th>Date</th><th>Item</th><th>Amount</th></tr>
    </thead><tbody>`;
  expenses.forEach(e => {
    html += `<tr class="border-b border-gray-700 text-center text-gray-800"><td>${e.date}</td><td>${e.item}</td><td>${e.amount}</td></tr>`;
  });
  html += `</tbody></table></div>`;

  // Summary
  const waxProfit = waxData.reduce((sum, w) => sum + w.profit, 0);
  const chalkProfit = chalkData.reduce((sum, c) => sum + c.profit, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const net = (waxProfit + chalkProfit - totalExpense).toFixed(2);

  html += `<div class="mt-6 text-lg font-semibold text-green-300">
    <p>Total Wax Profit: ৳ ${waxProfit.toFixed(2)}</p>
    <p>Total Chalk Profit: ৳ ${chalkProfit.toFixed(2)}</p>
    <p>Total Expense: ৳ ${totalExpense.toFixed(2)}</p>
    <p class="text-yellow-400">Net Balance: ৳ ${net}</p>
  </div>`;

  document.getElementById("reportContent").innerHTML = html;
}

function downloadReport() {
  const element = document.getElementById("reportContent");
  const opt = {
    margin: 0.3,
    filename: 'Sales_Report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().from(element).set(opt).save();
}





function exportAllData() {
  const data = {
    shops,
    waxSales: waxData,
    chalkSales: chalkData,
    expenses
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'sell_backup_data.json';
  a.click();

  URL.revokeObjectURL(url);
}


async function importAllData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const imported = JSON.parse(e.target.result);

      // Local variables update
      shops = imported.shops || [];
      waxData = imported.waxSales || [];
      chalkData = imported.chalkSales || [];
      expenses = imported.expenses || [];

      // 🔥 Clear Firebase collections first (optional but clean)
      await clearFirebaseCollection("shops");
      await clearFirebaseCollection("waxSales");
      await clearFirebaseCollection("chalkSales");
      await clearFirebaseCollection("expenses");

      // 🔁 Upload to Firebase
      for (let shop of shops) {
        await db.collection("shops").add(shop);
      }

      for (let wax of waxData) {
        await db.collection("waxSales").add(wax);
      }

      for (let chalk of chalkData) {
        await db.collection("chalkSales").add(chalk);
      }

      for (let exp of expenses) {
        await db.collection("expenses").add(exp);
      }

      // Save to localStorage
      saveData('shops');
      saveData('wax');
      saveData('chalk');
      saveExpenses();

      // Render everything
      renderShopList();
      renderShopListTable();
      renderTable('wax');
      renderTable('chalk');
      renderDueList('wax');
      renderDueList('chalk');
      renderExpenses();

      alert("✅ Import complete with Firebase sync!");

    } catch (err) {
      showToast("❌ Invalid JSON or Firebase Error");
      console.error(err);
    }
  };

  reader.readAsText(file);
}


async function clearFirebaseCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();

  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  return batch.commit();
}



// Chart.js related variables
let monthlyChart;
const chartStorageKey = 'monthlyHistoryChartData';

// Get "Month-Year" like "Jul-2025"
function getMonthYear(dateStr) {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]}-${date.getFullYear()}`;
}

// Build monthly summary data
function buildMonthlySummary() {
  const summary = JSON.parse(localStorage.getItem(chartStorageKey)) || {};

  // Aggregate Wax
  waxData.forEach(entry => {
    const month = getMonthYear(entry.date);
    if (!summary[month]) summary[month] = { wax: 0, chalk: 0, expense: 0 };
    summary[month].wax += entry.profit;
  });

  // Aggregate Chalk
  chalkData.forEach(entry => {
    const month = getMonthYear(entry.date);
    if (!summary[month]) summary[month] = { wax: 0, chalk: 0, expense: 0 };
    summary[month].chalk += entry.profit;
  });

  // Aggregate Expense
  expenses.forEach(entry => {
    const month = getMonthYear(entry.date);
    if (!summary[month]) summary[month] = { wax: 0, chalk: 0, expense: 0 };
    summary[month].expense += entry.amount;
  });

  // Save back
  return summary;
}

// Render chart
function renderMonthlyChart() {
  const ctx = document.getElementById('monthlyChart').getContext('2d');
  const summary = buildMonthlySummary();

  const months = Object.keys(summary);
  const waxProfits = months.map(m => summary[m].wax.toFixed(2));
  const chalkProfits = months.map(m => summary[m].chalk.toFixed(2));
  const expenses = months.map(m => summary[m].expense.toFixed(2));

  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
        label: 'Wax Profit',
        data: waxProfits,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderRadius: 5, // 🔥 Rounded bars
        borderSkipped: false,
        },
        {
         label: 'Chalk Profit',
        data: chalkProfits,
        backgroundColor: 'rgba(34,197,94,0.6)',
        borderRadius: 5,
        borderSkipped: false,
        },
        {
        label: 'Expense',
        data: expenses,
        backgroundColor: 'rgba(234,179,8,0.6)',
        borderRadius: 5,
        borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Monthly Profit vs Expense',
          color: '#facc15',
          font: { size: 16 }
        }
      },
      scales: {
        x: { ticks: { color: '#ddd' } },
        y: {
          beginAtZero: true,
          ticks: { color: '#ddd' }
        }
      }
    }
  });
}

// Optional Reset button
function resetChartHistory() {
  if (confirm('Reset monthly chart history?')) {
    localStorage.removeItem(chartStorageKey);
    renderMonthlyChart();
  }
}




//payment modal and calcution



function openPaymentModal(type, index) {
  document.getElementById('paymentModal').classList.remove('hidden');
  document.getElementById('paymentType').value = type;
  document.getElementById('paymentIndex').value = index;
  document.getElementById('paymentDate').valueAsDate = new Date();
  document.getElementById('paymentAmount').value = '';
}




function submitPartialPayment() {
  const type = document.getElementById('paymentType').value;
  const index = parseInt(document.getElementById('paymentIndex').value);
  const date = document.getElementById('paymentDate').value;
  const amount = parseFloat(document.getElementById('paymentAmount').value);

  if (!date || isNaN(amount) || amount <= 0) return;

  const data = type === 'wax' ? waxData : chalkData;
  const item = data[index];

  // Update payment and due
  item.payment += amount;
  item.due -= amount;
  if (item.due < 0) item.due = 0;

  // ✅ এখানে history push করো
if (!item.payments) item.payments = [];
item.payments.push({ date, amount }); //

  // 🔥 Firebase update
  db.collection(type + 'Sales')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const d = doc.data();
        const match =
          d.date === item.date &&
          d.shop === item.shop &&
          d.qty === item.qty &&
          d.rate === item.rate &&
          d.amount === item.amount &&
          d.profit === item.profit &&
          (type === 'chalk' ? d.size === item.size : true);

        if (match) {
          doc.ref.update({
            payment: item.payment,
            due: item.due,
            payments: item.payments || []
          });
        }
      });
    });

  // Save & Refresh
  saveData(type);
  renderTable(type);
  renderDueList(type);
  closeModal('payment');
}




function viewPaymentHistory(type, index) {
  const data = type === 'wax' ? waxData : chalkData;
  const item = data[index];
  const historyDiv = document.getElementById('historyContent');

  if (!item.payments || item.payments.length === 0) {
    historyDiv.innerHTML = '<p class="text-gray-400">No payment history found.</p>';
  } else {
    historyDiv.innerHTML = item.payments.map(p =>
      `<div>📅 <strong>${p.date}</strong> — 💵 ${p.amount.toFixed(2)} ৳</div>`
    ).join('');
  }

  document.getElementById('historyModal').classList.remove('hidden');
}



//open invoice modal


function openInvoiceModal() {
  document.getElementById('invoiceModal').classList.remove('hidden');

  const select = document.getElementById('invoiceShopSelect');
  select.innerHTML = '<option value="">-- Select Shop --</option>';
  shops.forEach(shop => {
    const opt = document.createElement('option');
    opt.value = shop.name;
    opt.textContent = shop.name;
    select.appendChild(opt);
  });

  document.getElementById('invoiceDate').valueAsDate = new Date();
}


//genarate invoice 

function generateInvoice() {
  const shopName = document.getElementById('invoiceShopSelect').value;
  const date = document.getElementById('invoiceDate').value;

  if (!shopName || !date) {
    showToast("❌ Shop and Date required", "error");
    return;
  }

  const waxItems = waxData.filter(d => d.shop === shopName && d.date === date);
  const chalkItems = chalkData.filter(d => d.shop === shopName && d.date === date);

  if (waxItems.length === 0 && chalkItems.length === 0) {
    showToast("❌ No matching sales found", "info");
    return;
  }

  // Find shop object (for address)
  const shopObj = shops.find(s => s.name === shopName);
  const shopAddress = shopObj?.address || "N/A";

  // Merge items
  const items = [];

  waxItems.forEach(item => {
    items.push({
      desc: 'Wax Sale',
      rate: item.rate,
      qty: item.qty,
      total: item.amount,
      payment: item.payment
    });
  });

  chalkItems.forEach(item => {
    items.push({
      desc: `Chalk (${item.size})`,
      rate: item.rate,
      qty: item.qty,
      total: item.amount,
      payment: item.payment
    });
  });

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = items.reduce((sum, i) => sum + i.payment, 0);
  const totalDue = subtotal - totalPaid;

  const invoiceNumber = 'INV-' + Date.now().toString().slice(-6);
  const today = new Date().toISOString().split('T')[0];

  const html = `
    <div id="invoiceContent" style="font-family: Arial, sans-serif; padding: 20px; color: black;">
      <h1 style="text-align:right; letter-spacing: 2px;">INVOICE</h1>
      <hr style="margin: 10px 0;">

      <div style="display:flex; justify-content:space-between; font-size: 14px;">
        <div>
          <strong>ISSUED TO:</strong><br>
          ${shopName}<br>
          ${shopAddress}<br>
        </div>
        <div style="text-align:right;">
          <strong>INVOICE NO:</strong> ${invoiceNumber}<br>
          <strong>DATE:</strong> ${today}<br>
          <strong>DUE DATE:</strong> ${today}<br>
        </div>
      </div>

      <div style="margin-top:20px; font-size: 14px;">
        <strong>PAY TO:</strong><br>
        Mayer Doya Enterprise<br>
        Account: 100711600001605 (Southest)<br>
        Bkash,Nogod: 01644705929
      </div>

      <h3 style="margin-top:30px;">ITEMS</h3>
      <table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:14px;">
        <thead>
          <tr>
            <th style="border-bottom:1px solid #ccc; text-align:left;">DESCRIPTION</th>
            <th style="border-bottom:1px solid #ccc; text-align:right;">UNIT PRICE</th>
            <th style="border-bottom:1px solid #ccc; text-align:right;">QTY</th>
            <th style="border-bottom:1px solid #ccc; text-align:right;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(i => `
            <tr>
              <td>${i.desc}</td>
              <td style="text-align:right;">${i.rate.toFixed(2)}</td>
              <td style="text-align:right;">${i.qty}</td>
              <td style="text-align:right;">${(i.total).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top:20px; text-align:right; font-size:14px;">
        <p><strong>Subtotal:</strong> ৳ ${subtotal.toFixed(2)}</p>
        <p><strong>Total Paid:</strong> ৳ ${totalPaid.toFixed(2)}</p>
        <p><strong>Due:</strong> ৳ ${totalDue.toFixed(2)}</p>
        <p><strong>Tax (0%):</strong> ৳ 0.00</p>
        <p><strong>Total:</strong> ৳ ${subtotal.toFixed(2)}</p>
      </div>

      <div style="margin-top:40px; text-align:right;">
          ______Pappu Hasan______<br>
        Authorized Signature
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = html;

  html2pdf().from(container).set({
    margin: 0.4,
    filename: `Invoice_${shopName}_${date}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a5', orientation: 'portrait' }
  }).save();

  closeModal('invoice');
}



//gettotal due by shoplist

function getTotalDueByShop(shopName) {
  const waxDue = waxData
    .filter(d => d.shop === shopName)
    .reduce((sum, d) => sum + d.due, 0);

  const chalkDue = chalkData
    .filter(d => d.shop === shopName)
    .reduce((sum, d) => sum + d.due, 0);

  return waxDue + chalkDue;
}

// send sms

async function sendDueSmsToAllCustomers() {
  const sent = [];
  const failed = [];

  for (const shop of shops) {
    const due = getTotalDueByShop(shop.name);
    const mobile = shop.mobile;

    if (!mobile || due <= 0) continue; // মোবাইল না থাকলে বা due না থাকলে skip

    const message = `Dear ${shop.name}, your total due is ৳${due.toFixed(2)}. Please clear as early as possible. Mayer Duya Enterprise visit https://www.facebook.com/chalkpoint`;

    const payload = {
      api_key: "8U0USSg4hgL9VedCUw2Y",
      msg: message,
      to: mobile
    };

    try {
      const res = await fetch("https://bulksmsbd.net/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data && data.status === "success") {
        sent.push(shop.name);
      } else {
        failed.push({ shop: shop.name, error: data.message || 'Unknown error' });
      }

    } catch (error) {
      failed.push({ shop: shop.name, error: error.message });
    }
  }

  showToast(`✅ SMS sent to ${sent.length} customers.\n❌ Failed: ${failed.length}`);
  console.log("Failed list:", failed);
}






//loadshopform firebase


function loadShopsFromFirebase() {
  db.collection("shops").get()
    .then((querySnapshot) => {
      shops = [];
      querySnapshot.forEach((doc) => {
        shops.push({ id: doc.id, ...doc.data() });
      });

      renderShopList();       // dropdown list update
      renderShopListTable();  // table list update
    })
    .catch((error) => {
      console.error("❌ Error loading shops:", error);
    });
}





    // Run init on page load
    window.onload = init;
     window.onload = function() {
      if (typeof init === 'function') init(); // Keep existing init if defined
      renderExpenses();
      window.nextDocToUpdate = null; // 🔁 reset at start
      loadShopsFromFirebase();
    }
