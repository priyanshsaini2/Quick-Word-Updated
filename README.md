# 📖 QuickWord – Instant Dictionary Extension

A lightweight Chrome/Edge browser extension for fast dictionary lookup while reading. Select any 1–2 words on a webpage and get instant definitions, examples, synonyms, and pronunciation. All looked-up words are saved locally for later review.

---

## 📁 Folder Structure

```
Dictionary Browser/
├── manifest.json                  # Extension manifest (Manifest V3)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── background/
│   └── service-worker.js          # Background service worker
├── content/
│   ├── content.js                 # In-page selection detection & popup
│   └── content.css                # Popup card & Define button styles
├── lib/
│   ├── dictionary.js              # Dictionary API + fallback
│   ├── local-dictionary.js        # Offline fallback word dataset
│   └── storage.js                 # IndexedDB word memory
└── popup/
    ├── popup.html                 # My Words review page
    ├── popup.css                  # My Words styles
    └── popup.js                   # My Words logic
```

---

## 🚀 Installation

### Chrome
1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `Dictionary Browser` folder
5. The QuickWord extension icon will appear in your toolbar ✅

### Microsoft Edge
1. Open Edge and navigate to `edge://extensions`
2. Enable **Developer mode** (toggle in the left sidebar)
3. Click **Load unpacked**
4. Select the `Dictionary Browser` folder
5. The QuickWord extension icon will appear in your toolbar ✅

### Brave
1. Open Brave and navigate to `brave://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `Dictionary Browser` folder ✅

---

## 🔧 How to Use

### Word Lookup
1. Navigate to any webpage (Wikipedia, news articles, books, etc.)
2. **Select 1 or 2 words** with your mouse
3. A floating **"📖"** (book icon) appears near the selected text
4. Click it → a popup card shows:
   - Word & phonetic pronunciation
   - Definitions (up to 3)
   - Example sentences
   - Synonyms
   - 🔊 Audio pronunciation button
5. The word is **automatically saved** to your My Words list

### My Words Review Page
1. Click the **QuickWord icon** in the browser toolbar
2. Browse all previously looked-up words
3. **Search** words by name, definition, or synonym
4. **Sort** by newest, oldest, or A–Z
5. **Delete** individual words with the ✕ button
6. **Clear All** to reset your word list

---

## 🌐 API & Offline Fallback

- **Primary**: [Free Dictionary API](https://api.dictionaryapi.dev/) — free, no API key needed
- **Fallback**: Built-in local dictionary (10 curated words) used when offline or API fails

---

## 🔒 Privacy

- **No tracking** — zero analytics, no external data collection
- **No account** required
- All data stored **locally** in your browser (IndexedDB)
- Minimal permissions: only `storage` and access to the dictionary API

---

## ⚡ Permissions Explained

| Permission | Reason |
|---|---|
| `storage` | Save words locally |
| `https://api.dictionaryapi.dev/*` | Fetch word definitions |

---

## 🛠 Troubleshooting

**Define button doesn't appear?**
- Make sure you're selecting **exactly 1 or 2 words** (no more)
- Reload the page after installing the extension
- Check that the extension is enabled in `chrome://extensions`

**No definition found?**
- Check your internet connection (API requires network)
- Try an alternative spelling
- The offline fallback covers ~10 common words

**Audio doesn't play?**
- Some API entries lack audio files — the extension will automatically use browser Text-to-Speech as a fallback
- Make sure your system volume is on

---

## 📝 License

MIT License — free to use, modify, and distribute.
