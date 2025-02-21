// جلب قائمة السور
async function loadSurahs() {
  try {
      const response = await fetch('http://api.alquran.cloud/v1/surah');
      const data = await response.json();
      displaySurahs(data.data);
  } catch (error) {
      console.error('حدث خطأ في جلب السور:', error);
  }
}

// عرض قائمة السور
function displaySurahs(surahs) {
  const container = document.getElementById('surahList');
  container.innerHTML = surahs.map(surah => `
      <div class="surah-card" onclick="loadSurahDetails(${surah.number})">
          <h3>(${surah.name})</h3>
          <p>عدد الآيات: ${surah.numberOfAyahs}</p>
          <p>النوع: ${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</p>
      </div>
  `).join('');
}

// تحميل تفاصيل السورة
async function loadSurahDetails(surahNumber) {
  try {
      // إظهار قسم التفاصيل وإخفاء القائمة
      document.getElementById('surahList').style.display = 'none';
      document.getElementById('surahDetails').style.display = 'block';

      // جلب النص القرآني
      const quranResponse = await fetch(`http://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
      const quranData = await quranResponse.json();

      // جلب التفسير
      const tafsirResponse = await fetch(`https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${surahNumber}`);
      const tafsirData = await tafsirResponse.json();

      // عرض النتائج
      displaySurahDetails(quranData.data, tafsirData.result);
  } catch (error) {
      console.error('حدث خطأ في جلب البيانات:', error);
  }
}

// عرض تفاصيل السورة
function displaySurahDetails(surah, tafsir) {
  const versesContainer = document.getElementById('versesContainer');
  const tafsirContainer = document.getElementById('tafsirContainer');

  versesContainer.innerHTML = `
      <h2>${surah.englishName} (${surah.name})</h2>
      ${surah.ayahs.map(ayah => `
          <div class="ayah">
              <p class="verse">(${ayah.numberInSurah}) ${ayah.text}</p>
          </div>
      `).join('')}
  `;

  tafsirContainer.innerHTML = `
      <h3>التفسير الميسر:</h3>
      ${tafsir.map(item => `
          <div class="tafsir">
              <p>(${item.aya}) ${item.translation}</p>
          </div>
      `).join('')}
  `;
}

// العودة لقائمة السور
function goBack() {
  document.getElementById('surahList').style.display = 'flex';
  document.getElementById('surahDetails').style.display = 'none';
  versesContainer.innerHTML = '';
  tafsirContainer.innerHTML = '';
}

// تحميل السور عند فتح الصفحة
loadSurahs();