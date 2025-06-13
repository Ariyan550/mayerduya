


// ------------------ Default Load Functions ------------------
window.addEventListener('DOMContentLoaded', () => {
  loadShops();
  loadShopOptions();
  loadTodaySales();
  updateChalkSummary();
  loadEmployees();
  updateDueList();
  renderSalesChart();
});

// ------------------ ইংলিশ চক বিক্রয় ------------------
let chalkSales = JSON.parse(localStorage.getItem('chalkSales') || '[]');
function saveChalkSales() {
  localStorage.setItem('chalkSales', JSON.stringify(chalkSales));
}
function addChalkSale() {
  const shopId = document.getElementById('chalkShop').value;
  const qty = parseFloat(document.getElementById('chalkQty').value);
  const tk = parseFloat(document.getElementById('chalkTk').value);
  const profit = parseFloat(document.getElementById('chalkProfit').value);
  const date = document.getElementById('chalkDate').value;

  if (!shopId || isNaN(qty) || isNaN(tk) || isNaN(profit) || !date) {
    alert('সঠিক তথ্য দিন');
    return;
  }

  chalkSales.push({ id: Date.now(), shopId, qty, tk, profit, date });
  saveChalkSales();
  alert('ইংলিশ চক বিক্রয় তথ্য সংরক্ষিত হয়েছে');
  document.getElementById('chalkQty').value = '';
  document.getElementById('chalkTk').value = '';
  document.getElementById('chalkProfit').value = '';
  document.getElementById('chalkDate').value = '';
  loadTodaySales();
  updateChalkSummary();
}

// ------------------ ব্যয় ------------------
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}
function addExpense() {
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const memo = document.getElementById('memo').value.trim();
  const date = document.getElementById('ieDate').value;

  if (isNaN(amount) || !memo || !date) {
    alert('সঠিক তথ্য দিন');
    return;
  }

  expenses.push({ id: Date.now(), amount, memo, date });
  saveExpenses();
  alert('ব্যয় সংরক্ষিত হয়েছে');
  document.getElementById('expenseAmount').value = '';
  document.getElementById('memo').value = '';
  document.getElementById('ieDate').value = '';
}

// ------------------ কর্মচারী ------------------
let employees = JSON.parse(localStorage.getItem('employees') || '[]');
function saveEmployees() {
  localStorage.setItem('employees', JSON.stringify(employees));
}
function addEmployee() {
  const name = document.getElementById('empName').value.trim();
  const mobile = document.getElementById('empMobile').value.trim();
  const salary = parseFloat(document.getElementById('empSalary').value);

  if (!name || !mobile || isNaN(salary)) {
    alert('সঠিক তথ্য দিন');
    return;
  }

  employees.push({ id: Date.now(), name, mobile, salary, attendance: 0, absence: 0, advance: 0 });
  saveEmployees();
  loadEmployees();
  document.getElementById('empName').value = '';
  document.getElementById('empMobile').value = '';
  document.getElementById('empSalary').value = '';
}
function loadEmployees() {
  const tbody = document.getElementById('employeeList');
  tbody.innerHTML = '';
  employees.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2">${emp.name}</td>
      <td class="px-4 py-2">${emp.mobile}</td>
      <td class="px-4 py-2">${emp.salary}</td>
      <td class="px-4 py-2">${emp.attendance || 0}</td>
      <td class="px-4 py-2">${emp.absence || 0}</td>
      <td class="px-4 py-2">${emp.advance || 0}</td>
      <td class="px-4 py-2 text-red-500 cursor-pointer" onclick="removeEmployee(${emp.id})">✖</td>
    `;
    tbody.appendChild(tr);
  });
}
function removeEmployee(id) {
  employees = employees.filter(e => e.id !== id);
  saveEmployees();
  loadEmployees();
}

// ------------------ বকেয়া ------------------
let dues = JSON.parse(localStorage.getItem('dues') || '[]');
function saveDues() {
  localStorage.setItem('dues', JSON.stringify(dues));
}
function updateDue() {
  const shopId = document.getElementById('dueShop').value;
  const amount = parseFloat(document.getElementById('dueAmount').value);
  if (!shopId || isNaN(amount)) {
    alert('সঠিক তথ্য দিন');
    return;
  }

  const existing = dues.find(d => d.shopId === shopId);
  if (existing) {
    existing.amount += amount;
  } else {
    dues.push({ shopId, amount });
  }
  saveDues();
  updateDueList();
}
function updateDueList() {
  const ul = document.getElementById('dueList');
  ul.innerHTML = '';
  dues.forEach(d => {
    const shop = shops.find(s => s.id == d.shopId);
    const li = document.createElement('li');
    li.textContent = `${shop ? shop.name : 'Unknown'}: ৳${d.amount}`;
    ul.appendChild(li);
  });
}

// ------------------ আজকের বিক্রয় ------------------
function loadTodaySales() {
  const today = new Date().toISOString().split('T')[0];
  const ul = document.getElementById('todaySales');
  ul.innerHTML = '';
  const todayWax = waxSales.filter(s => s.date === today);
  const todayChalk = chalkSales.filter(s => s.date === today);
  [...todayWax, ...todayChalk].forEach(sale => {
    const li = document.createElement('li');
    const shop = shops.find(s => s.id == sale.shopId);
    const name = shop ? shop.name : 'Unknown';
    const desc = sale.kg ? `${sale.kg} কেজি মোম` : `${sale.qty} চক`;
    li.textContent = `${name} - ${desc}, ৳${sale.tk}`;
    ul.appendChild(li);
  });
}

// ------------------ চক সামারি ------------------
function updateChalkSummary() {
  const total = chalkSales.reduce((acc, s) => {
    acc.qty += s.qty;
    acc.tk += s.tk;
    acc.profit += s.profit;
    return acc;
  }, { qty: 0, tk: 0, profit: 0 });
  const div = document.getElementById('chalkSummary');
  div.innerHTML = `মোট ${total.qty} চক বিক্রি, আয় ৳${total.tk}, লাভ ৳${total.profit}`;
}

// ------------------ চার্ট ------------------
function renderSalesChart() {
  const ctx = document.getElementById('salesChart').getContext('2d');
  const labels = ["মোম", "চক", "ব্যয়"];
  const totalWax = waxSales.reduce((sum, s) => sum + s.tk, 0);
  const totalChalk = chalkSales.reduce((sum, s) => sum + s.tk, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '৳ টাকায় হিসাব',
        data: [totalWax, totalChalk, totalExpense],
        backgroundColor: ['#10b981', '#6366f1', '#f43f5e']
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}
