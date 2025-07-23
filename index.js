    
 
   const showSection = (id) => {
      document.querySelectorAll('main > section').forEach(section => section.classList.add('hidden'));
      document.getElementById(id).classList.remove('hidden');
    }

    // Toast helper
    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // Calculator logic
    const calcDisplay = document.getElementById('calc-display');

    // Append value to calculator display
    function appendCalc(val) {
      calcDisplay.value += val;
    }

    // Clear calculator display
    function clearCalc() {
      calcDisplay.value = '';
    }

    // Calculate result safely
    function calculateResult() {
      try {
        // Replace × and ÷ with * and / for eval
        let expression = calcDisplay.value.replace(/×/g, '*').replace(/÷/g, '/');
        const result = eval(expression);
        calcDisplay.value = result;
      } catch {
        calcDisplay.value = 'Error';
      }
    }

    // Button click events for calculator
    document.querySelectorAll('#calculator-box button[data-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        appendCalc(btn.getAttribute('data-key'));
      });
    });

    document.getElementById('calc-equal').addEventListener('click', calculateResult);
    document.getElementById('calc-clear').addEventListener('click', clearCalc);

    // Keyboard support for calculator
let calculatorFocused = false;

const calculatorBox = document.getElementById('calculator-box');
const calculatorSection = document.getElementById('calculator');

// শুধু calculator box-এ click করলে focus হবে
calculatorBox.addEventListener('click', () => {
  if (!calculatorSection.classList.contains('hidden')) {
    calculatorFocused = true;
  }
});

// যেকোনো অন্য জায়গায় click করলে focus চলে যাবে
window.addEventListener('click', (e) => {
  if (!calculatorBox.contains(e.target)) {
    calculatorFocused = false;
  }
});

// শুধু যখন calculator visible এবং focused তখন keyboard কাজ করবে
window.addEventListener('keydown', (e) => {
  const activeElement = document.activeElement;
  const isTyping =
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.isContentEditable;

  if (
    !calculatorFocused ||
    calculatorSection.classList.contains('hidden') ||
    isTyping
  ) {
    return;
  }

  const allowedKeys = '0123456789+-*/.=';
  if (allowedKeys.includes(e.key)) {
    e.preventDefault();
    if (e.key === '=' || e.key === 'Enter') {
      calculateResult();
    } else if (e.key === '.') {
      appendCalc('.');
    } else {
      appendCalc(e.key);
    }
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    calcDisplay.value = calcDisplay.value.slice(0, -1);
  }
});


    // Orders logic
    const orderForm = document.getElementById('order-form');
    const orderTable = document.getElementById('order-table');

    const saveOrders = (orders) => localStorage.setItem('orders', JSON.stringify(orders));
    const loadOrders = () => JSON.parse(localStorage.getItem('orders') || '[]');

    const renderOrders = () => {
      orderTable.innerHTML = '';
      const orders = loadOrders();
      orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="px-4 py-2">${order.orderDate}</td>
          <td class="px-4 py-2">${order.deliveryDate}</td>
          <td class="px-4 py-2">${order.customer}</td>
          <td class="px-4 py-2">${order.description}</td>
          <td class="px-4 py-2 space-x-2">
            <button onclick="editOrder(${index})" class="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded">Edit</button>
            <button onclick="deleteOrder(${index})" class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded">Delete</button>
          </td>
        `;
        orderTable.appendChild(row);
      });
    }

orderForm.onsubmit = async (e) => {
  e.preventDefault();

  const orders = loadOrders();
  const orderDate = document.getElementById('order-date').value;
  const deliveryDate = document.getElementById('delivery-date').value;
  const customer = document.getElementById('order-customer').value.trim();
  const description = document.getElementById('order-description').value.trim();

  if (!orderDate || !deliveryDate || !customer) {
    alert('Please fill Order Date, Delivery Date, and Customer fields.');
    return;
  }

  // Unique Firebase ID তৈরি করো
  const firebaseDoc = db.collection("orders").doc();
  const firebaseId = firebaseDoc.id;

  const newOrder = {
    id: firebaseId, // 🔑 Firebase ID
    orderDate,
    deliveryDate,
    customer,
    description,
    createdAt: new Date()
  };

  orders.push(newOrder);
  saveOrders(orders);
  renderOrders();
  orderForm.reset();
  showSection('dashboard');
  showToast('Order added successfully!');

  try {
    await firebaseDoc.set(newOrder);
  } catch (err) {
    console.error("Firebase save failed", err);
    showToast("Saved locally but failed to save to Firebase.");
  }
};


async function syncFirebaseToLocal() {
  try {
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
    const firebaseOrders = [];
    snapshot.forEach(doc => {
      firebaseOrders.push({
        id: doc.id, // 🔑 Firebase document ID
        ...doc.data()
      });
    });
    saveOrders(firebaseOrders);
    renderOrders();
  } catch (error) {
    console.error("Error syncing Firebase to local:", error);
    showToast("Failed to sync from cloud.");
  }
}





   function deleteOrder(index) {
  const orders = loadOrders();
  const orderToDelete = orders[index];
  const firebaseId = orderToDelete.id;

  // LocalStorage থেকে সরাও
  orders.splice(index, 1);
  saveOrders(orders);
  renderOrders();
  showToast('Order deleted successfully!');

  // Firebase থেকেও সরাও
  if (firebaseId) {
    db.collection("orders").doc(firebaseId).delete()
      .then(() => console.log("✅ Firebase order deleted"))
      .catch((error) => {
        console.error("❌ Error deleting from Firebase:", error);
        showToast("Failed to delete from Firebase.");
      });
  }
}

    const editOrder = (index) => {
      const orders = loadOrders();
      const order = orders[index];
      document.getElementById('order-date').value = order.orderDate;
      document.getElementById('delivery-date').value = order.deliveryDate;
      document.getElementById('order-customer').value = order.customer;
      document.getElementById('order-description').value = order.description;
      deleteOrder(index);
      showSection('order');
      showToast('Edit the order and submit.');
    }

    // Password check
async function checkPassword() {
  const passInput = document.getElementById('password-input').value;

  try {
    const doc = await db.collection("settings").doc("app_pass").get();
    const savedPassword = doc.exists ? doc.data().password : "1234";

    if (passInput === savedPassword) {
      localStorage.setItem('session_pass', 'valid'); // ✅ লগইন সেশনে মনে রাখো
      document.getElementById('password-screen').classList.add('hidden');
      syncFirebaseToLocal();
      showSection('dashboard');
    } else {
      alert("Incorrect Password");
    }
  } catch (err) {
    console.error("Password check failed:", err);
    alert("Failed to check password.");
  }
}


const darkToggle = document.getElementById('dark-toggle');
const body = document.body;

function applyTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('bg-gray-900', 'text-white');
    body.classList.remove('bg-gray-100', 'text-gray-900');
    darkToggle.checked = true;
  } else {
    body.classList.add('bg-gray-100', 'text-gray-900');
    body.classList.remove('bg-gray-900', 'text-white');
    darkToggle.checked = false;
  }
  localStorage.setItem('theme', theme);
}

function applySavedTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  applyTheme(theme);
}

darkToggle.addEventListener('change', () => {
  const theme = darkToggle.checked ? 'dark' : 'light';
  applyTheme(theme);
  showToast(`${theme === 'dark' ? 'Dark' : 'Light'} mode activated!`);
});

applySavedTheme();




function setBusinessName() {
  const nameInput = document.getElementById('business-name').value.trim();
  if (nameInput) {
    localStorage.setItem('business_name', nameInput);
    document.getElementById('business-title').textContent = nameInput;
    showToast('Business name updated!');
  }
}

function applyBusinessName() {
  const storedName = localStorage.getItem('business_name');
  if (storedName) {
    document.getElementById('business-title').textContent = storedName;
    const nameInput = document.getElementById('business-name');
    if (nameInput) nameInput.value = storedName;
  }
}

applyBusinessName();

async function changePassword() {
  const oldPass = document.getElementById('current-password').value.trim();
  const newPass = document.getElementById('new-password').value.trim();

  if (newPass.length < 3) {
    showToast('Password must be at least 3 characters.');
    return;
  }

  try {
    const doc = await db.collection("settings").doc("app_pass").get();
    const savedPassword = doc.exists ? doc.data().password : "1234";

    if (oldPass !== savedPassword) {
      showToast('Current password incorrect!');
      return;
    }

    await db.collection("settings").doc("app_pass").set({ password: newPass });
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    showToast('Password changed successfully!');
  } catch (err) {
    console.error("Error changing password:", err);
    showToast("Failed to change password.");
  }
}




function logout() {
  localStorage.removeItem('session_pass');
  location.reload();
}



    // Initial load
window.onload = async () => {
  const session = localStorage.getItem('session_pass');
  if (session === 'valid') {
    document.getElementById('password-screen').classList.add('hidden');
    syncFirebaseToLocal();
    showSection('dashboard');
    return;
  }

  try {
    const doc = await db.collection("settings").doc("app_pass").get();
    const savedPassword = doc.exists ? doc.data().password : "1234";

    if (savedPassword === '1234') {
      document.getElementById('password-screen').classList.add('hidden');
      syncFirebaseToLocal();
      showSection('dashboard');
    } else {
      document.getElementById('password-input').focus();
    }
  } catch (err) {
    console.error("Failed to load password on start:", err);
    document.getElementById('password-input').focus();
  }
};

