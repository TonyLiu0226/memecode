/* global chrome */
(function () {
  // Token UI elements
  const sessionEl = document.getElementById('session');
  const csrfEl = document.getElementById('csrf');
  const copySessionBtn = document.getElementById('copy-session');
  const copyCsrfBtn = document.getElementById('copy-csrf');
  const statusEl = document.getElementById('status');

  // Blocker UI elements
  const prodStatusEl = document.getElementById('productivity-status');
  const checkStatusBtn = document.getElementById('check-status-btn');
  const stringencyEl = document.getElementById('stringency-level');

  const candidateUrls = [
    'https://leetcode.com',
    'https://www.leetcode.com',
    // Uncomment to support China site; ensure host_permissions include leetcode.cn
    'https://leetcode.cn',
    'https://www.leetcode.cn'
  ];

  const cookiesApi = (typeof browser !== 'undefined' && browser.cookies)
    ? browser.cookies
    : (typeof chrome !== 'undefined' ? chrome.cookies : undefined);

  function getCookie(details) {
    if (!cookiesApi) return Promise.resolve(undefined);
    if (typeof browser !== 'undefined' && cookiesApi === browser.cookies) {
      return cookiesApi.get(details);
    }
    return new Promise((resolve, reject) => {
      try {
        cookiesApi.get(details, (cookie) => {
          if (chrome && chrome.runtime && chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(cookie);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async function getCookieByName(name) {
    for (const url of candidateUrls) {
      try {
        const cookie = await getCookie({ url, name });
        if (cookie && cookie.value) return cookie.value;
      } catch (err) {
        // Ignore and continue
      }
    }
    return '';
  }

  async function loadTokens() {
    const [session, csrf] = await Promise.all([
      getCookieByName('LEETCODE_SESSION'),
      getCookieByName('csrftoken')
    ]);
    sessionEl.value = session || '';
    csrfEl.value = csrf || '';
    if (!session && !csrf) {
      setStatus('No cookies found. Log in at leetcode.com and reopen.', true);
    } else if (!session || !csrf) {
      setStatus('Some cookies missing. Ensure you are logged in.', true);
    } else {
      setStatus('Tokens loaded. Use the copy buttons below.');
    }
  }

  function setStatus(message, warn = false) {
    statusEl.textContent = message;
    statusEl.style.color = warn ? '#92400e' : '#065f46';
  }

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(`${label} copied to clipboard.`);
    } catch (err) {
      setStatus(`Failed to copy ${label}.`, true);
    }
  }

  // --- Blocker UI Logic ---

  async function loadBlockerState() {
    const data = await browser.storage.local.get(['isSolvedToday', 'expiryTime', 'stringencyLevel', 'isCheckingStatus']);
    updateStatusUI(data.isSolvedToday, data.expiryTime);
    
    if (data.stringencyLevel) {
      stringencyEl.value = data.stringencyLevel;
    }
    
    if (data.isCheckingStatus) {
      checkStatusBtn.textContent = 'Checking...';
      checkStatusBtn.disabled = true;
    } else {
      checkStatusBtn.textContent = 'Check Status Now';
      checkStatusBtn.disabled = false;
    }
  }

  function updateStatusUI(isSolved, expiryTime = null) {
    if (isSolved && expiryTime) {
      prodStatusEl.textContent = `Status: Unblocked until ${new Date(expiryTime).toLocaleString()}`;
      prodStatusEl.className = 'productivity-status unblocked';
    } else {
      prodStatusEl.textContent = 'Status: Blocked (Solve a problem!)';
      prodStatusEl.className = 'productivity-status blocked';
    }
  }

  stringencyEl.addEventListener('change', async (e) => {
    const newLevel = e.target.value;
    await browser.storage.local.set({ stringencyLevel: newLevel });
  });

  checkStatusBtn.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'checkStatusNow' });
  });



  // Listen for background state changes to keep UI in sync
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.isSolvedToday !== undefined) {
        updateStatusUI(changes.isSolvedToday.newValue, changes.expiryTime.newValue);
      }
      if (changes.stringencyLevel !== undefined) {
        stringencyEl.value = changes.stringencyLevel.newValue || '1';
      }
      if (changes.isCheckingStatus !== undefined) {
        if (changes.isCheckingStatus.newValue) {
          checkStatusBtn.textContent = 'Checking...';
          checkStatusBtn.disabled = true;
        } else {
          checkStatusBtn.textContent = 'Check Status Now';
          checkStatusBtn.disabled = false;
        }
      }
    }
  });

  copySessionBtn.addEventListener('click', () => copy(sessionEl.value, 'Session'));
  copyCsrfBtn.addEventListener('click', () => copy(csrfEl.value, 'CSRF token'));

  document.addEventListener('DOMContentLoaded', () => {
    loadTokens();
    loadBlockerState();
  });
  
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    loadTokens();
    loadBlockerState();
  }
})();
