// QuickWord – Content Script
// Detects text selection (1-2 words), shows Define button, renders popup card.

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────
  let defineBtn = null;
  let popupCard = null;
  let overlayEl = null;
  let activeWord = '';
  let currentAudioUrl = '';
  let selectionTimeout = null;

  // ── Helpers ────────────────────────────────────────────────────────────────
  function countWords(str) {
    return str.trim().split(/\s+/).filter(Boolean).length;
  }

  function getSelectionRect() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    return sel.getRangeAt(0).getBoundingClientRect();
  }

  function positionNear(el, rect) {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const elW = el.offsetWidth || 80;
    const elH = el.offsetHeight || 30;
    const GAP = 8;

    let top = scrollY + rect.bottom + GAP;
    let left = scrollX + rect.left + (rect.width / 2) - (elW / 2);

    // Clamp within viewport
    left = Math.max(scrollX + 4, Math.min(left, scrollX + window.innerWidth - elW - 4));

    // If overflows bottom, flip above
    if (top + elH > scrollY + window.innerHeight - 20) {
      top = scrollY + rect.top - elH - GAP;
    }

    el.style.top  = `${top}px`;
    el.style.left = `${left}px`;
  }

  // ── Define Button ──────────────────────────────────────────────────────────
  function showDefineButton(word, rect) {
    removeDefineButton();
    activeWord = word;

    defineBtn = document.createElement('button');
    defineBtn.id = 'qw-define-btn';
    defineBtn.innerHTML = `📖`;
    defineBtn.setAttribute('title', 'Look up word');
    defineBtn.setAttribute('aria-label', `Look up "${word}" in QuickWord`);

    defineBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDefineClick(word);
    });

    // Don't remove button when clicking it
    defineBtn.addEventListener('mousedown', e => e.stopPropagation());

    document.body.appendChild(defineBtn);
    // Position after DOM insertion so offsetWidth is available
    requestAnimationFrame(() => positionNear(defineBtn, rect));
  }

  function removeDefineButton() {
    if (defineBtn) { defineBtn.remove(); defineBtn = null; }
  }

  // ── Popup Card ─────────────────────────────────────────────────────────────
  function showLoadingPopup(word, rect) {
    removePopup();

    // Translucent click-away overlay
    overlayEl = document.createElement('div');
    overlayEl.id = 'qw-overlay';
    overlayEl.addEventListener('click', removePopup);
    document.body.appendChild(overlayEl);

    popupCard = document.createElement('div');
    popupCard.id = 'qw-popup-card';
    popupCard.setAttribute('role', 'dialog');
    popupCard.setAttribute('aria-modal', 'true');
    popupCard.setAttribute('aria-label', `QuickWord definition for ${word}`);
    popupCard.innerHTML = `
      <div class="qw-loading">
        <div class="qw-spinner"></div>
        Looking up <strong style="color:#A5B4FC">${word}</strong>…
      </div>`;

    popupCard.addEventListener('click', e => e.stopPropagation());
    document.body.appendChild(popupCard);
    requestAnimationFrame(() => positionPopup(rect));
  }

  function positionPopup(rect) {
    if (!popupCard) return;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const cardW = 320;
    const cardH = popupCard.offsetHeight || 280;
    const GAP = 10;

    let top  = scrollY + rect.bottom + GAP;
    let left = scrollX + rect.left + (rect.width / 2) - cardW / 2;

    left = Math.max(scrollX + 8, Math.min(left, scrollX + window.innerWidth - cardW - 8));

    if (top + cardH > scrollY + window.innerHeight - 20) {
      top = scrollY + rect.top - cardH - GAP;
    }
    if (top < scrollY + 8) top = scrollY + 8;

    popupCard.style.top  = `${top}px`;
    popupCard.style.left = `${left}px`;
  }

  function renderPopup(data, rect) {
    if (!popupCard) return;
    currentAudioUrl = data.audioUrl || '';

    const defsHTML = (data.definitions || []).map(d =>
      `<div class="qw-def-item">${escapeHTML(d)}</div>`
    ).join('');

    const examplesHTML = (data.examples || []).length
      ? `<div>
           <div class="qw-section-label">Examples</div>
           <div class="qw-example-list">
             ${(data.examples).map(ex => `<div class="qw-example-item">${escapeHTML(ex)}</div>`).join('')}
           </div>
         </div>`
      : '';

    const synonymsHTML = (data.synonyms || []).length
      ? `<div>
           <div class="qw-section-label">Synonyms</div>
           <div class="qw-synonyms">
             ${data.synonyms.map(s => `<span class="qw-synonym-chip">${escapeHTML(s)}</span>`).join('')}
           </div>
         </div>`
      : '';

    popupCard.innerHTML = `
      <div class="qw-header">
        <div class="qw-word-block">
          <span class="qw-word">${escapeHTML(data.word)}</span>
          ${data.phonetic ? `<span class="qw-phonetic">${escapeHTML(data.phonetic)}</span>` : ''}
        </div>
        <div class="qw-header-actions">
          <button class="qw-audio-btn" id="qw-audio-btn" title="Play pronunciation" aria-label="Play pronunciation">🔊</button>
          <button class="qw-close-btn" id="qw-close-btn" title="Close" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="qw-body">
        <div>
          <div class="qw-section-label">Definition</div>
          <div class="qw-def-list">${defsHTML}</div>
        </div>
        ${examplesHTML}
        ${synonymsHTML}
      </div>
      <div class="qw-footer">
        <span class="qw-saved-badge" id="qw-saved-badge" style="visibility:hidden">✓ Saved to My Words</span>
        <span class="qw-brand">QuickWord</span>
      </div>`;

    document.getElementById('qw-close-btn').addEventListener('click', removePopup);
    document.getElementById('qw-audio-btn').addEventListener('click', () => playAudio(data.word, data.audioUrl));

    // Re-position after full render
    requestAnimationFrame(() => positionPopup(rect));
  }

  function renderErrorPopup(word) {
    if (!popupCard) return;
    popupCard.innerHTML = `
      <div class="qw-header">
        <div class="qw-word-block">
          <span class="qw-word">${escapeHTML(word)}</span>
        </div>
        <div class="qw-header-actions">
          <button class="qw-close-btn" id="qw-close-btn" title="Close" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="qw-error">
        😕 No definition found for <strong>"${escapeHTML(word)}"</strong>.<br>
        <small style="color:#666;margin-top:4px;display:block">Try a different spelling or connect to the internet.</small>
      </div>
      <div class="qw-footer">
        <span></span>
        <span class="qw-brand">QuickWord</span>
      </div>`;
    document.getElementById('qw-close-btn').addEventListener('click', removePopup);
  }

  function removePopup() {
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
    if (popupCard) { popupCard.remove(); popupCard = null; }
  }

  // ── Audio ──────────────────────────────────────────────────────────────────
  function playAudio(word, audioUrl) {
    const btn = document.getElementById('qw-audio-btn');
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => useTTS(word));
    } else {
      useTTS(word);
    }
    if (btn) { btn.textContent = '🔊'; btn.style.color = '#A5B4FC'; }
  }

  function useTTS(word) {
    if ('speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(word);
      utt.lang = 'en-US';
      utt.rate = 0.9;
      window.speechSynthesis.speak(utt);
    }
  }

  // ── Core Flow ──────────────────────────────────────────────────────────────
  async function handleDefineClick(word) {
    removeDefineButton();
    const sel = window.getSelection();
    const rect = sel && sel.rangeCount > 0
      ? sel.getRangeAt(0).getBoundingClientRect()
      : { top: 100, bottom: 120, left: 100, right: 200, width: 100 };

    showLoadingPopup(word, rect);

    try {
      const data = await window.__QW_DictionaryAPI__.lookup(word);
      renderPopup(data, rect);

      // Save to memory
      const entry = {
        word: data.word || word,
        definition: (data.definitions || [])[0] || '',
        phonetic: data.phonetic || '',
        synonyms: data.synonyms || [],
        date: new Date().toISOString()
      };
      await window.__QW_WordMemory__.save(entry);
      
      // Update UI to show saved
      const badge = document.getElementById('qw-saved-badge');
      if (badge) { 
        badge.style.visibility = 'visible';
        badge.style.color = '#4ADE80';
      }

      console.log('[QuickWord] Word saved successfully:', entry.word);

      // Update extension badge
      const total = await window.__QW_WordMemory__.count();
      try {
        chrome.runtime.sendMessage({ type: 'UPDATE_BADGE', count: total });
      } catch (_) { /* Extension may not be active on this page */ }

    } catch (err) {
      console.warn('[QuickWord]', err.message);
      renderErrorPopup(word);
    }
  }

  // ── Selection Listener ─────────────────────────────────────────────────────
  function onSelectionChange() {
    clearTimeout(selectionTimeout);
    selectionTimeout = setTimeout(() => {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';

      // Ignore if popup is open – don't flicker the define button
      if (popupCard) return;
      // Ignore if inside our own UI
      if (sel && sel.anchorNode && document.getElementById('qw-popup-card')?.contains(sel.anchorNode)) return;

      if (!text || countWords(text) > 2 || countWords(text) < 1) {
        removeDefineButton();
        return;
      }

      const rect = getSelectionRect();
      if (!rect || rect.width === 0) { removeDefineButton(); return; }

      showDefineButton(text, rect);
    }, 300);
  }

  document.addEventListener('selectionchange', onSelectionChange);

  // Dismiss on outside click
  document.addEventListener('mousedown', (e) => {
    if (defineBtn && !defineBtn.contains(e.target)) {
      removeDefineButton();
    }
  });

  // Dismiss popup on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { removeDefineButton(); removePopup(); }
  });

  // ── Utility ────────────────────────────────────────────────────────────────
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
