import fs from 'fs';
import https from 'https';

const CACHE_FILE = './src/data/kahf.json';

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

async function generateData() {
  console.log("Fetching data from Quran API...");
  // Fetch Ayahs 1-10
  const url1 = 'https://api.quran.com/api/v4/verses/by_chapter/18?language=en&words=true&word_fields=text_uthmani&offset=0&limit=10';
  const data1 = await fetchJson(url1);
  
  // Fetch Ayahs 101-110
  const url2 = 'https://api.quran.com/api/v4/verses/by_chapter/18?language=en&words=true&word_fields=text_uthmani&offset=100&limit=10';
  const data2 = await fetchJson(url2);

  const processVerses = (verses) => {
    return verses.map((verse, index) => {
      const words = verse.words.filter(w => w.char_type_name === 'word');
      const arabic = words.map(w => w.text_uthmani).join(' ');
      
      const english = words.map(w => w.translation?.text || '').filter(Boolean).join(' ');

      const transliteration = words.map(w => w.transliteration?.text || '').filter(Boolean).join(' ');

      // Select a random significant word to blank out
      const validWords = words.filter(w => w.text_uthmani.length > 3);
      let targetWordObj = validWords.length > 0 ? validWords[Math.floor(Math.random() * validWords.length)] : words[0];
      const targetWord = targetWordObj.text_uthmani;
      
      // Plausible wrong options: random words from anywhere
      const allOtherWords = verses.flatMap(v => v.words.filter(w => w.char_type_name === 'word' && w.text_uthmani !== targetWord && w.text_uthmani.length > 3));
      const shuffled = allOtherWords.sort(() => 0.5 - Math.random());
      const wrongOptions = Array.from(new Set(shuffled.map(w => w.text_uthmani))).slice(0, 3);
      
      const options = [targetWord, ...wrongOptions].sort(() => 0.5 - Math.random());
      const correctIndex = options.indexOf(targetWord);

      return {
        id: verse.id,
        verse_key: verse.verse_key,
        arabic: arabic,
        english: english,
        transliteration: transliteration,
        words: words.map(w => w.text_uthmani),
        blanks: [
          {
            word: targetWord,
            options: options,
            correctIndex: correctIndex
          }
        ]
      };
    });
  };

  const finalData = {
    first10: processVerses(data1.verses),
    last10: processVerses(data2.verses)
  };

  if (!fs.existsSync('./src/data')) {
    fs.mkdirSync('./src/data');
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(finalData, null, 2));
  console.log("Data successfully generated at", CACHE_FILE);
}

generateData().catch(console.error);
