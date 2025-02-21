let currentCategory = null;
let currentZikrIndex = 0;
let currentCount = 0;
let azkarData = {};

async function loadAzkar() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json');
        azkarData = await response.json();
        displayCategories();
    } catch (error) {
        console.error('حدث خطأ في جلب البيانات:', error);
    }
}

function displayCategories() {
    const categoriesContainer = document.getElementById('categories');
    const categories = Object.keys(azkarData);
    
    categoriesContainer.innerHTML = categories.map(category => `
        <div class="category-card" onclick="loadCategory('${category}')">
            <h3>${category.replace('_', ' ')}</h3>
            <p>عدد الأذكار: ${azkarData[category].length}</p>
        </div>
    `).join('');
}

function loadCategory(category) {
    currentCategory = category;
    currentZikrIndex = 0;
    currentCount = 0;
    showZikr();
    document.getElementById('categories').style.display = 'none';
    document.getElementById('zikrContainer').style.display = 'block';
}

function showZikr() {
    const zikr = azkarData[currentCategory][currentZikrIndex];
    document.getElementById('zikrTitle').textContent = zikr.title || currentCategory.replace('_', ' ');
    document.getElementById('zikrContent').innerHTML = `
        <p class="zikr-text">${zikr.content}</p>
        ${zikr.description ? `<p class="zikr-description">${zikr.description}</p>` : ''}
    `;
    document.getElementById('currentCount').textContent = currentCount;
}

function nextZikr() {
    if (currentZikrIndex < azkarData[currentCategory].length - 1) {
        currentZikrIndex++;
        currentCount = 0;
        showZikr();
    }
}

function prevZikr() {
    if (currentZikrIndex > 0) {
        currentZikrIndex--;
        currentCount = 0;
        showZikr();
    }
}

function incrementCounter() {
    currentCount++;
    document.getElementById('currentCount').textContent = currentCount;
}

function resetCounter() {
    currentCount = 0;
    document.getElementById('currentCount').textContent = currentCount;
}

function goBack() {
    document.getElementById('categories').style.display = 'grid';
    document.getElementById('zikrContainer').style.display = 'none';
}

// تحميل البيانات عند فتح الصفحة
loadAzkar();