// QuickWord – Storage Module
// Uses chrome.storage.local for robust, cross-context persistence.

const WordMemory = (() => {
  const KEY = 'qw_saved_words';

  // Helper to get all from chrome storage
  function _getWords() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([KEY], (result) => {
        if (chrome.runtime.lastError) {
          console.error('[QuickWord Storage] Get error:', chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[KEY] || {});
        }
      });
    });
  }

  function _setWords(words) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [KEY]: words }, () => {
        if (chrome.runtime.lastError) {
          console.error('[QuickWord Storage] Set error:', chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  async function save(entry) {
    if (!entry || !entry.word) {
      console.error('[QuickWord Storage] Invalid entry attempted:', entry);
      return;
    }
    
    const words = await _getWords();
    const wordKey = entry.word.trim().toLowerCase();
    
    words[wordKey] = {
      word: entry.word,
      definition: entry.definition,
      phonetic: entry.phonetic || '',
      synonyms: entry.synonyms || [],
      date: entry.date || new Date().toISOString()
    };
    
    await _setWords(words);
    const newCount = Object.keys(words).length;
    console.log(`[QuickWord Storage] Saved "${entry.word}". Total words in memory: ${newCount}`);
    return entry.word;
  }

  async function getAll() {
    const wordsMap = await _getWords();
    const wordsList = Object.values(wordsMap);
    // Sort by date descending
    return wordsList.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async function remove(word) {
    const words = await _getWords();
    delete words[word.toLowerCase()];
    await _setWords(words);
  }

  async function count() {
    const words = await _getWords();
    return Object.keys(words).length;
  }

  async function clearAll() {
    await _setWords({});
  }

  return { save, getAll, remove, count, clearAll };
})();

window.__QW_WordMemory__ = WordMemory;
