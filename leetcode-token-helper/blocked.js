const browser = globalThis.browser || globalThis.chrome;

function updateStatusCheck() {
  browser.runtime.sendMessage({ action: 'checkStatusNow' }, (response) => {
  });
}

function updateLastChecked() {
  const currentTime = new Date().toLocaleTimeString();
  document.getElementById('last-checked').textContent = currentTime;
}

document.addEventListener('DOMContentLoaded', () => {
  const progressContainer = document.querySelector('.progress-container');
  let secondsElapsed = 0;

  function setPercentage() {
    const percentage = progressContainer.getAttribute('data-percentage') + '%';
    
    const progressEl = progressContainer.querySelector('.progress');
    const percentageEl = progressContainer.querySelector('.percentage');
    
    progressEl.style.width = percentage;
    percentageEl.innerText = percentage;
    percentageEl.style.left = percentage;
  }

  // Initial check and setup
  updateStatusCheck();
  updateLastChecked();
  progressContainer.setAttribute('data-percentage', '0');
  setPercentage();

  // Set timer to update progress every second
  setInterval(() => {
    secondsElapsed++;
    
    if (secondsElapsed >= 60) {
      secondsElapsed = 0;
      updateStatusCheck();
      updateLastChecked();
    }
    
    const currentPercentage = Math.round((secondsElapsed / 60) * 100);
    progressContainer.setAttribute('data-percentage', currentPercentage);
    setPercentage();
  }, 1000);
});
