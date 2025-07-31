const translations = {
  en: {
    dashboard: "Dashboard",
    sellWax: "Sell Wax",
    sellChalk: "Sell Chalk",
    manageShop: "Manage Shop",
    summary: "Summary",
    chalkSummary: "Chalk Summary",
    report: "Report",
    invoice: "Invoice",
    settings: "Settings",
    totalDue: "Total Due",
    totalQty: "Total Qty",
    totalAmount: "Total ৳",
    profit: "Profit",
    quantity: "Quantity",
    rate: "Rate",
    amount: "Amount",
    payment: "Payment",
    due: "Due",
    date: "Date",
    shop: "Shop",
    size: "Size",
    edit: "Edit",
    delete: "Delete",
    addShop: "Add Shop",
    shopList: "Shop List",
    shopName: "Shop Name",
    shopAddress: "Shop Address",
    mobileNumber: "Mobile Number",
    useLocation: "Use My Location",
    cancel: "Cancel",
    submit: "Submit",
    expenses: "Expense Management",
    item: "Item",
    add: "Add",
    totalExpense: "Total Expense",
    generateInvoice: "Generate Invoice",
    selectShop: "Select Shop",
    selectDate: "Select Date",
    importExport: "Import & Export",
    exportData: "Export Data",
    importData: "Import Data",
    resetData: "Reset All Data",
    resetAll: "Reset All Data",
    language: "Language",
    openShopMap: "Open Shop Map",
    downloadPdf: "Download PDF",
    paymentHistory: "Payment History",
    addPayment: "Add Payment",
    amountOnly: "Amount",
    paymentDate: "Payment Date",
    monthlyChartTitle: "Monthly Profit & Expense Overview",
    resetChartHistory: "Reset Chart History",
    sendDueSms: "Send Due SMS",
    shopCount: "Total Shops",
    developedBy: "Developed for Mayer Duya Enterprise"
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    sellWax: "মোম বিক্রি",
    sellChalk: "চক বিক্রি",
    manageShop: "দোকান ব্যবস্থাপনা",
    summary: "সারাংশ",
    chalkSummary: "চক সাইজ সারাংশ",
    report: "রিপোর্ট",
    invoice: "চালান",
    settings: "সেটিংস",
    totalDue: "মোট বাকি",
    totalQty: "মোট পরিমাণ",
    totalAmount: "মোট টাকা",
    profit: "লাভ",
    quantity: "পরিমাণ",
    rate: "রেট",
    amount: "টাকা",
    payment: "পরিশোধ",
    due: "বাকি",
    date: "তারিখ",
    shop: "দোকান",
    size: "সাইজ",
    edit: "এডিট",
    delete: "ডিলিট",
    addShop: "➕ নতুন দোকান",
    shopList: "📋 দোকান তালিকা",
    shopName: "দোকানের নাম",
    shopAddress: "ঠিকানা",
    mobileNumber: "মোবাইল নম্বর",
    useLocation: "📍 লোকেশন ব্যবহার করো",
    cancel: "বাতিল",
    submit: "সাবমিট",
    expenses: "ব্যয় ব্যবস্থাপনা",
    item: "আইটেম",
    add: "যোগ করো",
    totalExpense: "মোট খরচ",
    generateInvoice: "চালান তৈরি করো",
    selectShop: "দোকান নির্বাচন করো",
    selectDate: "তারিখ নির্বাচন করো",
    importExport: "ইম্পোর্ট ও এক্সপোর্ট",
    exportData: "📤 ডাটা এক্সপোর্ট",
    importData: "📥 ডাটা ইম্পোর্ট",
    resetData: "🗑️ সকল ডাটা মুছো",
    resetAll: "সব মুছে ফেলো",
    language: "ভাষা",
    openShopMap: "দোকান ম্যাপ খুলুন",
    downloadPdf: "⬇ পিডিএফ ডাউনলোড",
    paymentHistory: "📜 পরিশোধ ইতিহাস",
    addPayment: "🧾 নতুন পরিশোধ",
    amountOnly: "টাকা",
    paymentDate: "পরিশোধের তারিখ",
    monthlyChartTitle: "মাসিক লাভ ও খরচের পরিসংখ্যান",
    resetChartHistory: "চার্ট ইতিহাস রিসেট করো",
    sendDueSms: "📤 বাকি SMS পাঠাও",
    shopCount: "মোট দোকান",
    developedBy: "মায়ের দোয়া এন্টারপ্রাইজ-এর জন্য তৈরি"
  }
};



function applyTranslations(lang) {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    el.textContent = translations[lang][key] || key;
  });
  localStorage.setItem('selectedLang', lang);
}

document.getElementById('languageToggle').addEventListener('change', function () {
  applyTranslations(this.value);
});


window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selectedLang') || 'en';
  document.getElementById('languageToggle').value = savedLang;
  applyTranslations(savedLang);
});
