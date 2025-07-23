  // Element references
    const modal = document.getElementById('purchaseModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');

    const dateInput = document.getElementById('date');
    const waxQtyInput = document.getElementById('waxQty');
    const waxRateInput = document.getElementById('waxRate');
    const waxAmountInput = document.getElementById('waxAmount');
    const stearicQtyInput = document.getElementById('stearicQty');
    const stearicRateInput = document.getElementById('stearicRate');
    const stearicAmountInput = document.getElementById('stearicAmount');
    const atozInput = document.getElementById('atoz');
    const grandTotalInput = document.getElementById('grandTotal');
    const prevDueInput = document.getElementById('prevDue');
    const paymentInput = document.getElementById('payment');
    const bankInput = document.getElementById('bank');
    const paymentDateInput = document.getElementById('paymentDate');
    const totalDueInput = document.getElementById('totalDue');

    const filterInput = document.getElementById('filterInput');
    const tableBody = document.getElementById('tableBody');
    const pagination = document.getElementById('pagination');

    let currentPage = 1;
    const rowsPerPage = 8;

    // For edit mode
    let editIndex = -1;

    function openModal() {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (editIndex === -1) {
        modalTitle.textContent = 'ক্রয় ফর্ম';
        submitBtn.textContent = 'Submit';
        clearForm();
      }
    }

    function closeModal() {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      editIndex = -1;
    }

    function clearForm() {
      dateInput.value = '';
      waxQtyInput.value = '';
      waxRateInput.value = '';
      waxAmountInput.value = '';
      stearicQtyInput.value = '';
      stearicRateInput.value = '';
      stearicAmountInput.value = '';
      atozInput.value = '';
      grandTotalInput.value = '';
      prevDueInput.value = '';
      paymentInput.value = '';
      bankInput.value = 'IBBL';
      paymentDateInput.value = '';
      totalDueInput.value = '';
    }

    function calculateAll() {
      const waxQty = parseFloat(waxQtyInput.value) || 0;
      const waxRate = parseFloat(waxRateInput.value) || 0;
      const stearicQty = parseFloat(stearicQtyInput.value) || 0;
      const stearicRate = parseFloat(stearicRateInput.value) || 0;
      const atoz = parseFloat(atozInput.value) || 0;
      const prevDue = parseFloat(prevDueInput.value) || 0;
      const payment = parseFloat(paymentInput.value) || 0;

      const waxAmount = waxQty * waxRate;
      const stearicAmount = stearicQty * stearicRate;
      const total = waxAmount + stearicAmount + atoz;
      const totalDue = total + prevDue - payment;

      waxAmountInput.value = waxAmount.toFixed(2);
      stearicAmountInput.value = stearicAmount.toFixed(2);
      grandTotalInput.value = total.toFixed(2);
      totalDueInput.value = totalDue.toFixed(2);
    }

    function submitData() {
      if (!dateInput.value) {
        alert('তারিখ দিন');
        return;
      }

      const newData = {
        date: dateInput.value,
        waxQty: parseFloat(waxQtyInput.value) || 0,
        waxRate: parseFloat(waxRateInput.value) || 0,
        waxAmount: parseFloat(waxAmountInput.value) || 0,
        stearicQty: parseFloat(stearicQtyInput.value) || 0,
        stearicRate: parseFloat(stearicRateInput.value) || 0,
        stearicAmount: parseFloat(stearicAmountInput.value) || 0,
        atoz: parseFloat(atozInput.value) || 0,
        total: parseFloat(grandTotalInput.value) || 0,
        prevDue: parseFloat(prevDueInput.value) || 0,
        payment: parseFloat(paymentInput.value) || 0,
        bank: bankInput.value,
        paymentDate: paymentDateInput.value,
        totalDue: parseFloat(totalDueInput.value) || 0,
      };

      let purchases = JSON.parse(localStorage.getItem('purchases') || '[]');

      if (editIndex >= 0) {
        purchases[editIndex] = newData;
        editIndex = -1;
      } else {
        purchases.push(newData);
      }

      localStorage.setItem('purchases', JSON.stringify(purchases));
      renderTable();
      closeModal();
    }

    function renderTable() {
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const filterDate = filterInput.value;
      const filtered = filterDate ? purchases.filter(item => item.date === filterDate) : purchases;

      tableBody.innerHTML = '';

      const start = (currentPage - 1) * rowsPerPage;
      const paginated = filtered.slice(start, start + rowsPerPage);

      paginated.forEach((item, idx) => {
        const realIndex = purchases.indexOf(item);
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-600';

        row.innerHTML = `
          <td class='px-4 py-2'>${item.date}</td>
          <td class='px-4 py-2'>${item.waxQty}</td>
          <td class='px-4 py-2'>${item.waxRate}</td>
          <td class='px-4 py-2'>${item.waxAmount.toFixed(2)}</td>
          <td class='px-4 py-2'>${item.stearicQty}</td>
          <td class='px-4 py-2'>${item.stearicRate}</td>
          <td class='px-4 py-2'>${item.stearicAmount.toFixed(2)}</td>
          <td class='px-4 py-2'>${item.atoz.toFixed(2)}</td>
          <td class='px-4 py-2'>${item.total.toFixed(2)}</td>
          <td class='px-4 py-2'>${item.prevDue.toFixed(2)}</td>
          <td class='px-4 py-2'>${item.payment.toFixed(2)}</td>
          <td class='px-4 py-2'>${item.bank}</td>
          <td class='px-4 py-2'>${item.paymentDate}</td>
          <td class='px-4 py-2'>${item.totalDue.toFixed(2)}</td>
          <td class='px-4 py-2'>
            <button onclick="editRow(${realIndex})" class='bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded mr-1'>Edit</button>
            <button onclick="deleteRow(${realIndex})" class='bg-red-600 hover:bg-red-700 px-2 py-1 rounded'>Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      renderPagination(filtered.length);
    }

    function renderPagination(totalRows) {
      pagination.innerHTML = '';
      const pageCount = Math.ceil(totalRows / rowsPerPage);

      for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = i === currentPage
          ? 'bg-blue-500 text-white px-3 py-1 rounded'
          : 'bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600';

        btn.onclick = () => {
          currentPage = i;
          renderTable();
        };
        pagination.appendChild(btn);
      }
    }

    function deleteRow(index) {
      let purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      purchases.splice(index, 1);
      localStorage.setItem('purchases', JSON.stringify(purchases));

      // Adjust current page if needed
      if ((currentPage - 1) * rowsPerPage >= purchases.length && currentPage > 1) {
        currentPage--;
      }

      renderTable();
    }

    function filterTable() {
      currentPage = 1;
      renderTable();
    }

    // Edit ফাংশন - মডালে ডাটা নিয়ে আসবে
    function editRow(index) {
      let purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const item = purchases[index];
      editIndex = index;

      modalTitle.textContent = 'এডিট করুন';
      submitBtn.textContent = 'Update';

      // Set values in form
      dateInput.value = item.date;
      waxQtyInput.value = item.waxQty;
      waxRateInput.value = item.waxRate;
      waxAmountInput.value = item.waxAmount;
      stearicQtyInput.value = item.stearicQty;
      stearicRateInput.value = item.stearicRate;
      stearicAmountInput.value = item.stearicAmount;
      atozInput.value = item.atoz;
      grandTotalInput.value = item.total;
      prevDueInput.value = item.prevDue;
      paymentInput.value = item.payment;
      bankInput.value = item.bank;
      paymentDateInput.value = item.paymentDate;
      totalDueInput.value = item.totalDue;

      openModal();
    }

    // মাসিক রিপোর্ট জেনারেট (রিপোর্ট সেকশন)
    function generateReport() {
      const selectedMonth = document.getElementById('reportMonth').value;
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const filtered = purchases.filter(item => item.date.startsWith(selectedMonth));

      let totalWax = 0,
          totalStearic = 0,
          totalAtoZ = 0,
          totalAmount = 0;

      filtered.forEach(item => {
        totalWax += item.waxQty;
        totalStearic += item.stearicQty;
        totalAtoZ += item.atoz;
        totalAmount += item.total;
      });

      document.getElementById('reportBody').innerHTML = `
        <tr class="hover:bg-gray-600">
          <td class="px-4 py-2">${totalWax.toFixed(2)}</td>
          <td class="px-4 py-2">${totalStearic.toFixed(2)}</td>
          <td class="px-4 py-2">${totalAtoZ.toFixed(2)}</td>
          <td class="px-4 py-2">${totalAmount.toFixed(2)}</td>
        </tr>
      `;
    }

    // PDF export: এখন টেবিল ডাটার উপর ভিত্তি করে (ফিল্টারড ডাটা)
    async function exportPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("মায়ের দোয়া এন্টারপ্রাইজ", 20, 20);
      doc.setFontSize(12);
      doc.text(`Purchase Data Report`, 20, 30);

      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const filterDate = filterInput.value;
      const filtered = filterDate ? purchases.filter(item => item.date === filterDate) : purchases;

      const headers = [
        [
          "তারিখ",
          "Wax (কেজি)",
          "Rate",
          "Amount",
          "Stearic",
          "Rate",
          "Amount",
          "A-Z",
          "Total",
          "Prev Due",
          "Payment",
          "Bank",
          "Payment Date",
          "Total Due"
        ],
      ];

      const body = filtered.map(item => [
        item.date,
        item.waxQty.toFixed(2),
        item.waxRate.toFixed(2),
        item.waxAmount.toFixed(2),
        item.stearicQty.toFixed(2),
        item.stearicRate.toFixed(2),
        item.stearicAmount.toFixed(2),
        item.atoz.toFixed(2),
        item.total.toFixed(2),
        item.prevDue.toFixed(2),
        item.payment.toFixed(2),
        item.bank,
        item.paymentDate || '',
        item.totalDue.toFixed(2)
      ]);

      doc.autoTable({
        head: headers,
        body: body,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 30, 30] }
      });

      doc.save(`Purchase_Report_${new Date().toISOString().slice(0,10)}.pdf`);
    }

    window.onload = () => {
      renderTable();
    };
