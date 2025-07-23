// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA6rXO-U3T9IXunkFbSTNS-SMSJ-fHIVEw",
  authDomain: "sell-aabc1.firebaseapp.com",
  projectId: "sell-aabc1",
  storageBucket: "sell-aabc1.firebasestorage.app",
  messagingSenderId: "967989130190",
  appId: "1:967989130190:web:4784dab0ff6a0ca7b7719f",
  measurementId: "G-GSNKKFZXZT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const employeesRef = db.collection("employees");

    const FIXED_SALARY = 8000;
    const WORKING_DAYS = 26;
    let employees = [];
    let editingIndex = -1; // -1 means not editing

    function saveToLocal() {
      localStorage.setItem("employeesData", JSON.stringify(employees));
    }

    function loadFromLocal() {
      const data = localStorage.getItem("employeesData");
      if (data) {
        employees = JSON.parse(data);
      }
    }

    function renderTable() {
      const tbody = document.getElementById('employeeTable');
      tbody.innerHTML = '';

      employees.forEach((emp, index) => {
        const attendanceCount = emp.attendanceDates.length;
        const baseSalary = Math.round((emp.salary / WORKING_DAYS) * attendanceCount);
        const totalSalary = baseSalary + (emp.overtime * 30) - emp.advance;

        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800';

        row.innerHTML = `
          <td class="border border-gray-600 p-2">
            <input type="checkbox" id="attendCheck${index}" />
          </td>
          <td class="border border-gray-600 p-2">${emp.name}</td>
          <td class="border border-gray-600 p-2">${emp.phone}</td>
          <td class="border border-gray-600 p-2">${emp.post}</td>
          <td class="border border-gray-600 p-2 text-green-400 font-bold">${attendanceCount}</td>
          <td class="border border-gray-600 p-2">
            <input type="number" value="${emp.overtime}" onchange="updateOvertime(${index}, this.value)" class="w-16 p-1 border border-gray-600 rounded bg-gray-700 text-gray-200">
          </td>
          <td class="border border-gray-600 p-2">
            <input type="number" value="${emp.advance}" onchange="updateAdvance(${index}, this.value)" class="w-16 p-1 border border-gray-600 rounded bg-gray-700 text-gray-200">
          </td>
          <td class="border border-gray-600 p-2 font-bold text-blue-400">${totalSalary}৳</td>
          <td class="border border-gray-600 p-2 space-x-2">
            <button onclick="editEmployee(${index})" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded font-semibold transition">Edit</button>
            <button onclick="deleteEmployee(${index})" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold transition">Delete</button>
            <button onclick="downloadEmployeeMonthlyReport(${index})" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded font-semibold transition">Report</button>
          </td>
        `;

        tbody.appendChild(row);
      });
    }

function addEmployee() {
  const name = document.getElementById('empName').value.trim();
  const phone = document.getElementById('empPhone').value.trim();
  const post = document.getElementById('empPost').value.trim();
  const salary = parseInt(document.getElementById('empSalary').value.trim()) || 0;

  if (!name || !phone || !post || !salary) {
    alert('Please fill all inputs');
    return false;
  }

  const newEmp = {
    name,
    phone,
    post,
    salary,
    attendanceDates: [],
    overtime: 0,
    advance: 0,
  };

  // Local add
  employees.push(newEmp);
  saveToLocal();
  renderTable();
  clearForm();

  // Firebase add
  employeesRef.add(newEmp)
    .then(() => console.log("✅ Firebase: employee added"))
    .catch((err) => console.error("❌ Firebase add error", err));
}


    function updateEmployee() {
      const name = document.getElementById('empName').value.trim();
      const phone = document.getElementById('empPhone').value.trim();
      const post = document.getElementById('empPost').value.trim();
      const salary = parseInt(document.getElementById('empSalary').value.trim()) || 0;


      if (!name || !phone || !post) {
        alert('Please fill all inputs');
        return false;
      }

      employees[editingIndex].name = name;
      employees[editingIndex].phone = phone;
      employees[editingIndex].post = post;
      employees[editingIndex].salary = salary;


 const docId = employees[editingIndex].id;
  if (docId) {
    employeesRef.doc(docId).update({
      name, phone, post, salary
    })
    .then(() => console.log("✅ Firebase: employee updated"))
    .catch((err) => console.error("❌ Firebase update error", err));
  }




      saveToLocal();
      renderTable();
      clearForm();
      editingIndex = -1;
      document.getElementById('formTitle').textContent = 'Add New Employee';
      document.getElementById('submitBtn').textContent = 'Add';
    }

    function submitEmployee() {
      if (editingIndex === -1) {
        addEmployee();
      } else {
        updateEmployee();
      }
    }

    function clearForm() {
      document.getElementById('empName').value = '';
      document.getElementById('empPhone').value = '';
      document.getElementById('empPost').value = '';
      document.getElementById('empSalary').value = '';
    }

    function editEmployee(index) {
      editingIndex = index;
      const emp = employees[index];
      document.getElementById('empName').value = emp.name;
      document.getElementById('empPhone').value = emp.phone;
      document.getElementById('empPost').value = emp.post;
      document.getElementById('empSalary').value = emp.salary;


      document.getElementById('formTitle').textContent = 'Edit Employee';
      document.getElementById('submitBtn').textContent = 'Update';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteEmployee(index) {
  if (confirm('Are you sure to delete this employee?')) {
    const docId = employees[index].id;
    if (docId) {
      employeesRef.doc(docId).delete()
        .then(() => console.log("✅ Firebase: employee deleted"))
        .catch((err) => console.error("❌ Firebase delete error", err));
    }

    employees.splice(index, 1);
    saveToLocal();
    renderTable();
  }
}





    function markAttendance() {
      const date = document.getElementById('attendanceDate').value;
      if (!date) {
        alert("Please select a date");
        return;
      }

      employees.forEach((emp, index) => {
        const check = document.getElementById(`attendCheck${index}`);
        if (check && check.checked) {
          if (!emp.attendanceDates.includes(date)) {
            emp.attendanceDates.push(date);
          }if (emp.id) {
  employeesRef.doc(emp.id).update({
    attendanceDates: emp.attendanceDates
  })
  .then(() => console.log(`✅ Attendance updated in Firebase for ${emp.name}`))
  .catch(err => console.error(`❌ Firebase update error`, err));
}

        }
      });

      saveToLocal();
      renderTable();
    }





    function updateOvertime(index, value) {
      employees[index].overtime = parseInt(value || 0);

      const docId = employees[index].id;
if (docId) {
  employeesRef.doc(docId).update({
    overtime: parseInt(value || 0)
  })
  .then(() => console.log("✅ Overtime updated in Firebase"))
  .catch(err => console.error("❌ Firebase overtime error", err));
}

      saveToLocal();
      renderTable();
    }




    function updateAdvance(index, value) {
      employees[index].advance = parseInt(value || 0);
const docId = employees[index].id;
if (docId) {
  employeesRef.doc(docId).update({
    advance: parseInt(value || 0)
  })
  .then(() => console.log("✅ Advance updated in Firebase"))
  .catch(err => console.error("❌ Firebase advance error", err));
}

      saveToLocal();
      renderTable();
    }

    function checkAttendanceByDate() {
      const date = document.getElementById('reportDate').value;
      const container = document.getElementById('reportResult');

      if (!date) {
        alert("Please select a date");
        return;
      }

      let html = `<table class="min-w-full border text-center mt-2 border-gray-600">
        <thead class="bg-gray-700 text-gray-200">
          <tr>
            <th class="border border-gray-600 p-2">Name</th>
            <th class="border border-gray-600 p-2">Position</th>
            <th class="border border-gray-600 p-2">Status</th>
          </tr>
        </thead>
        <tbody>`;

      employees.forEach(emp => {
        const present = emp.attendanceDates.includes(date);
        html += `
          <tr class="${present ? 'bg-green-900' : 'bg-red-900'} text-gray-200 font-semibold">
            <td class="border border-gray-600 p-2">${emp.name}</td>
            <td class="border border-gray-600 p-2">${emp.post}</td>
            <td class="border border-gray-600 p-2">
              ${present ? '✅ Present' : '❌ Absent'}
            </td>
          </tr>`;
      });

      html += "</tbody></table>";
      container.innerHTML = html;
    }

    // =================
    // Individual employee monthly report download in PDF
    async function downloadEmployeeMonthlyReport(index) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const emp = employees[index];
      if (!emp) {
        alert("Employee not found");
        return;
      }

      // Ask user for month input (for report)
      let monthInput = prompt("Enter month for report (YYYY-MM):");
      if (!monthInput || !/^\d{4}-\d{2}$/.test(monthInput)) {
        alert("Invalid month format");
        return;
      }

      const [year, month] = monthInput.split('-');
      const startDate = new Date(year, month -1, 1);
      const endDate = new Date(year, month, 0); // last day of month

      // Filter attendance in that month
      const attendanceInMonth = emp.attendanceDates.filter(dateStr => {
        const d = new Date(dateStr);
        return d >= startDate && d <= endDate;
      });

      const attendanceCount = attendanceInMonth.length;
      const baseSalary = Math.round((emp.salary / WORKING_DAYS) * attendanceCount);
      const totalSalary = baseSalary + (emp.overtime * 30) - emp.advance;

      // PDF Title
      doc.setFontSize(16);
      doc.text(`Monthly Attendance & Salary Report`, 105, 20, null, null, "center");
      doc.setFontSize(12);
      doc.text(`Employee: ${emp.name}`, 105, 30, null, null, "center");
      doc.text(`Month: ${monthInput}`, 105, 38, null, null, "center");

      // Table header center aligned
      const startY = 50;
      const colX = [30, 90, 140, 180];
      const rowHeight = 10;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      // Draw header background
      doc.setFillColor(200, 200, 200);
      doc.rect(20, startY - 7, 170, 10, 'F');

      // Header text centered inside columns
      doc.textCentered = function(text, x, y, width) {
        const textWidth = this.getTextWidth(text);
        this.text(text, x + (width - textWidth)/2, y);
      };

      // We'll define column widths:
      const colWidths = [60, 40, 40, 40];
      // Headers:
      const headers = ["Field", "Value", "", ""];
      // But better show attendance, overtime, advance, total salary as field-value pairs

      // So let's do a vertical list instead of wide table (better for PDF width):

      let lineY = startY;

      const lines = [
        ["Name", emp.name],
        ["Position", emp.post],
        ["Attendance Days", attendanceCount.toString()],
        ["Overtime", emp.overtime.toString()],
        ["Advance", emp.advance.toString()],
        ["Total Salary", totalSalary + " ৳"]
      ];

      lines.forEach(([field, value]) => {
        doc.text(field, 60, lineY);
        doc.text(value, 140, lineY);
        lineY += rowHeight;
      });

      doc.save(`Employee_Report_${emp.name.replace(/\s+/g,"_")}_${monthInput}.pdf`);
    }



function toggleNotification() {
  const box = document.getElementById("notificationBox");
  box.classList.toggle("hidden");
}

function checkMissingAttendance() {
  const today = new Date();
  const dateList = [];

  const notifyList = document.getElementById("notificationList");
  const badge = document.getElementById("notificationBadge");

  notifyList.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date();
    checkDate.setDate(today.getDate() - i);

    // ✅ এখন আমরা লোকাল টাইম ধরে নিচ্ছি
    const yyyy = checkDate.getFullYear();
    const mm = String(checkDate.getMonth() + 1).padStart(2, '0');
    const dd = String(checkDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    // ⛔ শুক্রবার হলে skip করো
    if (checkDate.getDay() === 5) continue;

    let present = false;
    for (let emp of employees) {
      if (emp.attendanceDates.includes(dateStr)) {
        present = true;
        break;
      }
    }

    if (!present) {
      dateList.push(dateStr);
      const li = document.createElement("li");
      li.textContent = `❌ ${dateStr} attendance missing`;
      notifyList.appendChild(li);
    }
  }

  if (dateList.length > 0) {
    badge.textContent = dateList.length;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

async function loadFromFirebase() {
  try {
    const snapshot = await employeesRef.get();
    employees = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id; // Firestore ID রাখা হবে পরবর্তী edit/delete এর জন্য
      employees.push(data);
    });

    saveToLocal();  // লোকালি সেভ করা
    renderTable();  // টেবিলে দেখানো
    checkMissingAttendance();
  } catch (err) {
    console.error("❌ Firebase load error:", err);
  }
}

    // =================

    // Load existing data
  window.onload = function () {
  loadFromFirebase().catch(() => {
    loadFromLocal();
    renderTable();
  });
  checkMissingAttendance();
};



