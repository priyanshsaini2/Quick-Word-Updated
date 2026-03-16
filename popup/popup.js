// QuickWord – Popup Page JavaScript (My Words)

(function () {
  'use strict';

  const WordMemory = window.__QW_WordMemory__;

  // ── State ──────────────────────────────────────────────────────────────────
  let allWords = [];
  let currentSort = 'newest';
  let searchQuery = '';

  // ── DOM Refs ───────────────────────────────────────────────────────────────
  const wordList        = document.getElementById('word-list');
  const emptyState      = document.getElementById('empty-state');
  const noResultsState  = document.getElementById('no-results-state');
  const countBadge      = document.getElementById('word-count-badge');
  const searchInput     = document.getElementById('search-input');
  const clearSearch     = document.getElementById('clear-search');
  const clearAllBtn     = document.getElementById('clear-all-btn');
  const dialogBackdrop  = document.getElementById('dialog-backdrop');
  const dialogCount     = document.getElementById('dialog-count');
  const dialogCancel    = document.getElementById('dialog-cancel');
  const dialogConfirm   = document.getElementById('dialog-confirm');

  // ── Utilities ──────────────────────────────────────────────────────────────
  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  // ── Sort & Filter ──────────────────────────────────────────────────────────
  function getSortedFiltered() {
    let words = [...allWords];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      words = words.filter(w =>
        w.word.toLowerCase().includes(q) ||
        (w.definition || '').toLowerCase().includes(q) ||
        (w.synonyms || []).some(s => s.toLowerCase().includes(q))
      );
    }

    // Sort
    if (currentSort === 'newest') {
      words.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (currentSort === 'oldest') {
      words.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (currentSort === 'alpha') {
      words.sort((a, b) => a.word.localeCompare(b.word));
    }

    return words;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  function renderWords() {
    const filtered = getSortedFiltered();
    wordList.innerHTML = '';

    const showEmpty   = allWords.length === 0;
    const showNoMatch = allWords.length > 0 && filtered.length === 0 && searchQuery;

    emptyState.hidden     = !showEmpty;
    noResultsState.hidden = !showNoMatch;
    wordList.style.display = (showEmpty || showNoMatch) ? 'none' : '';

    if (showEmpty || showNoMatch) return;

    filtered.forEach(entry => {
      const card = document.createElement('article');
      card.className = 'word-card';
      card.setAttribute('role', 'listitem');

      const synonymsHTML = (entry.synonyms || []).slice(0, 5)
        .map(s => `<span class="synonym-chip">${escapeHTML(s)}</span>`)
        .join('');

      card.innerHTML = `
        <div class="word-card-header">
          <div class="word-card-main">
            <span class="word-card-title">${escapeHTML(capitalize(entry.word))}</span>
            ${entry.phonetic ? `<span class="word-card-phonetic">${escapeHTML(entry.phonetic)}</span>` : ''}
          </div>
          <div class="word-card-actions">
            <span class="word-card-date">${formatDate(entry.date)}</span>
            <button class="delete-word-btn" data-word="${escapeHTML(entry.word)}" title="Remove ${escapeHTML(entry.word)}" aria-label="Remove ${escapeHTML(entry.word)}">✕</button>
          </div>
        </div>
        ${entry.definition ? `<p class="word-card-def">${escapeHTML(entry.definition)}</p>` : ''}
        ${synonymsHTML ? `<div class="word-card-synonyms">${synonymsHTML}</div>` : ''}
      `;

      // Delete handler
      card.querySelector('.delete-word-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        const word = e.currentTarget.dataset.word;
        await WordMemory.remove(word);
        allWords = allWords.filter(w => w.word !== word);
        updateBadge();
        renderWords();
      });

      wordList.appendChild(card);
    });
  }

  function updateBadge() {
    const count = allWords.length;
    countBadge.textContent = `${count} word${count !== 1 ? 's' : ''}`;
  }

  // ── Load Data ──────────────────────────────────────────────────────────────
  async function loadWords() {
    try {
      allWords = await WordMemory.getAll();
      console.log(`[QuickWord Popup] Loaded ${allWords.length} words from storage.`);
    } catch (err) {
      console.error('[QuickWord Popup] Failed to load words:', err);
      allWords = [];
    }
    updateBadge();
    renderWords();
  }

  // ── Event Listeners ────────────────────────────────────────────────────────

  // Search
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    clearSearch.classList.toggle('visible', searchQuery.length > 0);
    renderWords();
  });

  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearch.classList.remove('visible');
    searchInput.focus();
    renderWords();
  });

  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentSort = btn.dataset.sort;
      renderWords();
    });
  });

  // Clear all
  clearAllBtn.addEventListener('click', () => {
    if (allWords.length === 0) return;
    dialogCount.textContent = `${allWords.length} saved word${allWords.length !== 1 ? 's' : ''}`;
    dialogBackdrop.hidden = false;
  });

  dialogCancel.addEventListener('click', () => { dialogBackdrop.hidden = true; });
  dialogBackdrop.addEventListener('click', (e) => {
    if (e.target === dialogBackdrop) dialogBackdrop.hidden = true;
  });

  dialogConfirm.addEventListener('click', async () => {
    dialogBackdrop.hidden = true;
    try {
      await WordMemory.clearAll();
      allWords = [];
      updateBadge();
      renderWords();
      
      // Update extension badge
      try {
        chrome.runtime.sendMessage({ type: 'UPDATE_BADGE', count: 0 });
      } catch (_) {}
    } catch (err) {
      console.error('[QuickWord] Failed to clear all words:', err);
    }
  });

  // Keyboard: close dialog on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dialogBackdrop.hidden) {
      dialogBackdrop.hidden = true;
    }
  });

  // Listen for storage changes from other contexts (the content script)
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.qw_saved_words) {
      console.log('[QuickWord Popup] Storage changed, refreshing...');
      loadWords();
    }
  });

  // ── Init ───────────────────────────────────────────────────────────────────
  loadWords();
})();
