// المسبحة الإلكترونية
let counter = 0;

function incrementCounter() {
    counter++;
    document.querySelector(".counter").textContent = counter;
}

function resetCounter() {
    counter = 0;
    document.querySelector(".counter").textContent = counter;
}

// بيانات الأذكار
let azkar = [];

async function loadAzkar() {
    const response = await fetch("https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json");
    const data = await response.json();
    azkar = data.أذكار_الصباح;
    document.getElementById("zikr-text").textContent = azkar[0];
}

let currentZikrIndex = 0;

function nextZikr() {
    currentZikrIndex = (currentZikrIndex + 1) % azkar.length;
    document.getElementById("zikr-text").textContent = azkar[currentZikrIndex];
}

function prevZikr() {
    currentZikrIndex = (currentZikrIndex - 1 + azkar.length) % azkar.length;
    document.getElementById("zikr-text").textContent = azkar[currentZikrIndex];
}

// القرآن الكريم
const surahSelect = document.getElementById("surah-select");

async function loadSurahs() {
    const response = await fetch("http://api.alquran.cloud/v1/surah");
    const data = await response.json();
    data.data.forEach(surah => {
        const option = document.createElement("option");
        option.value = surah.number;
        option.textContent = surah.englishName + " - " + surah.name;
        surahSelect.appendChild(option);
    });
}

async function loadSurah() {
    const surahNumber = surahSelect.value;
    const quranVersesDiv = document.getElementById("quran-verses");
    const tafsirTextDiv = document.getElementById("tafsir-text");

    quranVersesDiv.innerHTML = "جاري التحميل...";
    tafsirTextDiv.innerHTML = "";

    try {
        const response = await fetch(`http://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
        const data = await response.json();
        quranVersesDiv.innerHTML = data.data.ayahs.map(ayah => `<p>(${ayah.numberInSurah}) ${ayah.text}</p>`).join("");

        const tafsirResponse = await fetch(`https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${surahNumber}`);
        const tafsirData = await tafsirResponse.json();
        tafsirTextDiv.innerHTML = tafsirData.result.map(ayah => `<p>(${ayah.aya}) ${ayah.translation}</p>`).join("");
    } catch (error) {
        quranVersesDiv.innerHTML = "حدث خطأ أثناء جلب البيانات.";
        console.error(error);
    }
}

// التقويم الهجري
function getHijriDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', calendar: 'islamic' };
    const hijriDate = new Intl.DateTimeFormat('ar-EG', options).format(date);
    document.getElementById("hijri-date").textContent = hijriDate;
}

// البحث عن الأحاديث
async function searchHadith() {
    const searchText = document.getElementById("hadith-search-input").value;
    const resultsDiv = document.getElementById("hadith-results");
    resultsDiv.innerHTML = "جاري البحث...";

    try {
        const response = await fetch(`https://hadis-api-id.vercel.app/hadith/abu-dawud?page=2&limit=300`);
        const data = await response.json();
        const filteredHadiths = data.items.filter(hadith => hadith.arabic.includes(searchText));
        resultsDiv.innerHTML = filteredHadiths.map(hadith => `<p>${hadith.arabic}</p>`).join("");
    } catch (error) {
        resultsDiv.innerHTML = "حدث خطأ أثناء البحث.";
        console.error(error);
    }
}

// مواقيت الصلاة
async function loadPrayerTimes() {
    try {
        const response = await fetch("https://api.aladhan.com/v1/timingsByCity?city=cairo&country=egypt&method=8");
        const data = await response.json();
        const timings = data.data.timings;
        
        // عرض مواقيت الصلاة في كروت
        const prayerTimesDiv = document.getElementById('prayerTimes');
        prayerTimesDiv.innerHTML = `
            <div class="prayer-card">
                <h3>الفجر</h3>
                <p>${timings.Fajr}</p>
            </div>
            <div class="prayer-card">
                <h3>الشروق</h3>
                <p>${timings.Sunrise}</p>
            </div>
            <div class="prayer-card">
                <h3>الظهر</h3>
                <p>${timings.Dhuhr}</p>
            </div>
            <div class="prayer-card">
                <h3>العصر</h3>
                <p>${timings.Asr}</p>
            </div>
            <div class="prayer-card">
                <h3>المغرب</h3>
                <p>${timings.Maghrib}</p>
            </div>
            <div class="prayer-card">
                <h3>العشاء</h3>
                <p>${timings.Isha}</p>
            </div>
        `;

        // حساب الوقت المتبقي
        const now = new Date();
        const fajrTime = convertToDate(timings.Fajr);
        const maghribTime = convertToDate(timings.Maghrib);

        const fajrRemaining = getRemainingTime(fajrTime);
        const maghribRemaining = getRemainingTime(maghribTime);

        document.getElementById('fajr-remaining').textContent = fajrRemaining;
        document.getElementById('maghrib-remaining').textContent = maghribRemaining;

    } catch (error) {
        console.error('حدث خطأ في جلب المواقيت:', error);
    }
}

// دالة مساعدة للتحويل إلى وقت
function convertToDate(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
}

// دالة حساب الوقت المتبقي
function getRemainingTime(targetTime) {
    const now = new Date();
    if (now > targetTime) targetTime.setDate(targetTime.getDate() + 1);
    
    const diff = targetTime - now;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    
    return `${hours} ساعة ${minutes} دقيقة`;
}

// تحميل البيانات عند فتح الصفحة
loadAzkar();
loadSurahs();
getHijriDate();
loadPrayerTimes();