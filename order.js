function toggleOrderMenu() {
  document.getElementById('orderSubMenu').classList.toggle('hidden');
}

function openOrderModal() {
  document.getElementById('orderModal').classList.remove('hidden');
  loadShopsToDropdown();
}

function closeOrderModal() {
  document.getElementById('orderModal').classList.add('hidden');
  resetOrderForm();
}

function openOrderListModal() {
  document.getElementById('orderListModal').classList.remove('hidden');
  renderOrderList();
}

function closeOrderListModal() {
  document.getElementById('orderListModal').classList.add('hidden');
}

function resetOrderForm() {
  ['orderDate', 'deliveryDate', 'orderShop', 'orderDescription'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const btn = document.getElementById('orderSubmitBtn');
  btn.textContent = '✅ Submit Order';
  btn.setAttribute('onclick', 'submitOrder()');
}

async function loadShopsToDropdown() {
  const shopSelect = document.getElementById('orderShop');
  shopSelect.innerHTML = '<option value="">Select Shop</option>';
  const snapshot = await firebase.firestore().collection('shops').get();
  snapshot.forEach(doc => {
    const shop = doc.data();
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = shop.name;
    shopSelect.appendChild(option);
  });
}

async function submitOrder() {
  const order = {
    orderDate: document.getElementById('orderDate').value,
    deliveryDate: document.getElementById('deliveryDate').value,
    shopId: document.getElementById('orderShop').value,
    description: document.getElementById('orderDescription').value,
    createdAt: new Date().toISOString()
  };

  if (!order.orderDate || !order.deliveryDate || !order.shopId) {
    showToast('Please fill all required fields');
    return;
  }

  await firebase.firestore().collection('orders').add(order);
  showToast('✅ Order submitted');
  closeOrderModal();
  renderOrderList();
}


async function renderOrderList() {
  const container = document.getElementById('orderListContainer');
  container.innerHTML = '';

  const ordersSnap = await firebase.firestore().collection('orders').orderBy('createdAt', 'desc').get();

  for (const doc of ordersSnap.docs) {
    const data = doc.data();

    // 🔍 Get Shop Name from shopId
    let shopName = '(Unknown Shop)';
    if (data.shopId) {
      const shopDoc = await firebase.firestore().collection('shops').doc(data.shopId).get();
      if (shopDoc.exists) {
        shopName = shopDoc.data().name || shopName;
      }
    }

    const div = document.createElement('div');
    div.className = 'bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col justify-between';
    div.innerHTML = `
      <div class="mb-2">
        <h3 class="text-lg font-semibold text-gray-800 mb-1">🛍️ ${shopName}</h3>
        <p class="text-sm text-gray-500">🗓️ ${data.orderDate} → 🚚 ${data.deliveryDate}</p>
        <p class="text-gray-700 mt-2">${data.description || '(No description)'}</p>
      </div>
      <div class="flex justify-end space-x-2">
        <button onclick="editOrder('${doc.id}')" class="text-blue-600 hover:underline">✏️ Edit</button>
        <button onclick="deleteOrder('${doc.id}')" class="text-red-600 hover:underline">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(div);
  }
}





async function deleteOrder(id) {
  if (!confirm('Are you sure to delete?')) return;
  await firebase.firestore().collection('orders').doc(id).delete();
  renderOrderList();
}

async function editOrder(id) {
  const doc = await firebase.firestore().collection('orders').doc(id).get();
  const data = doc.data();
  document.getElementById('orderDate').value = data.orderDate;
  document.getElementById('deliveryDate').value = data.deliveryDate;
  document.getElementById('orderShop').value = data.shopId;
  document.getElementById('orderDescription').value = data.description;
  openOrderModal();
  const btn = document.getElementById('orderSubmitBtn');
  btn.textContent = '💾 Update Order';
  btn.setAttribute('onclick', `updateOrder('${id}')`);
}

async function updateOrder(id) {
  const updatedOrder = {
    orderDate: document.getElementById('orderDate').value,
    deliveryDate: document.getElementById('deliveryDate').value,
    shopId: document.getElementById('orderShop').value,
    description: document.getElementById('orderDescription').value
  };
  await firebase.firestore().collection('orders').doc(id).update(updatedOrder);
  showToast('✅ Order updated');
  closeOrderModal();
  renderOrderList();
}

window.addEventListener('load', () => {
  loadShopsToDropdown();
});
