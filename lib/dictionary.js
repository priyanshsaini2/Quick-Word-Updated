// QuickWord – Dictionary API Module
// Primary: Free Dictionary API (dictionaryapi.dev)
// Fallback: LOCAL_DICTIONARY from local-dictionary.js

const DictionaryAPI = (() => {
  const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  function _parseAPIResponse(data) {
    const entry = data[0];
    const phonetics = entry.phonetics || [];
    // Find first phonetic with text
    const phoneticObj = phonetics.find(p => p.text) || {};
    // Find first audio
    const audioObj = phonetics.find(p => p.audio && p.audio.length > 0) || {};

    const allDefs = [];
    const allExamples = [];
    const allSynonyms = new Set();

    (entry.meanings || []).forEach(meaning => {
      (meaning.definitions || []).forEach(def => {
        if (allDefs.length < 3) {
          allDefs.push(`(${meaning.partOfSpeech}) ${def.definition}`);
        }
        if (def.example && allExamples.length < 3) {
          allExamples.push(def.example);
        }
        (def.synonyms || []).forEach(s => allSynonyms.add(s));
      });
      (meaning.synonyms || []).forEach(s => allSynonyms.add(s));
    });

    return {
      word: entry.word,
      phonetic: phoneticObj.text || '',
      audioUrl: audioObj.audio || '',
      definitions: allDefs.slice(0, 3),
      examples: allExamples.slice(0, 3),
      synonyms: [...allSynonyms].slice(0, 8)
    };
  }

  function _fromLocal(word) {
    const dict = window.__QW_LOCAL_DICT__ || {};
    const key = word.toLowerCase();
    if (dict[key]) {
      return { word: key, ...dict[key] };
    }
    return null;
  }

  async function lookup(word) {
    const clean = word.trim().toLowerCase().replace(/[^a-zA-Z'-]/g, '');
    if (!clean) throw new Error('Invalid word');

    // Try API first
    try {
      const resp = await fetch(`${BASE_URL}${encodeURIComponent(clean)}`, {
        signal: AbortSignal.timeout(10000) // Increased to 10s
      });
      if (!resp.ok) {
        if (resp.status === 404) throw new Error('NOT_FOUND');
        throw new Error(`API_ERROR_${resp.status}`);
      }
      const data = await resp.json();
      return _parseAPIResponse(data);
    } catch (apiErr) {
      if (apiErr.message === 'NOT_FOUND') {
        console.warn(`[QuickWord] Word "${clean}" not found in online API.`);
      } else {
        console.warn('[QuickWord] Network/API Error:', apiErr.message);
      }
    }

    // Local fallback
    const local = _fromLocal(clean);
    if (local) {
      console.log(`[QuickWord] Using local fallback for "${clean}"`);
      return local;
    }

    throw new Error(`No definition found for "${word}"`);
  }

  return { lookup };
})();

window.__QW_DictionaryAPI__ = DictionaryAPI;
