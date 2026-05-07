const ALARM_NAME = 'checkLeetCodeStatus';
const CHECK_INTERVAL_MINUTES = 1;

let isSolvedToday = false;
let stringencyLevel = '1';

// Predefined lists
const adultSites = ['pornhub.com', 'xvideos.com', 'xnxx.com', 'youporn.com', 'redtube.com', 'onlyfans.com'];
const socialSites = ['reddit.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'tiktok.com', 'discord.com', 'snapchat.com',
  'wechat.com', 'weibo.com'
];
const entertainmentSites = ['youtube.com', 'netflix.com', 'amazon.com', 'crunchyroll.com', 'twitch.tv', 'hulu.com', 'disneyplus.com'];

// Initialize
async function init() {
  const data = await browser.storage.local.get(['isSolvedToday', 'stringencyLevel']);
  isSolvedToday = data.isSolvedToday || false;
  stringencyLevel = data.stringencyLevel || '1';

  await checkLeetCodeStatus();

  browser.alarms.create(ALARM_NAME, {
    periodInMinutes: CHECK_INTERVAL_MINUTES
  });
}

// Listen for storage changes to update stringency immediately
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    if (changes.stringencyLevel) {
      stringencyLevel = changes.stringencyLevel.newValue || '1';
    }
    if (changes.isSolvedToday) {
      isSolvedToday = changes.isSolvedToday.newValue || false;
    }
  }
});

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    checkLeetCodeStatus();
  }
});

async function checkLeetCodeStatus() {
  try {
    // 1. Get username
    const globalDataRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `query globalData { userStatus { username isSignedIn } }`
      })
    });

    if (!globalDataRes.ok) return;
    const globalData = await globalDataRes.json();

    if (!globalData?.data?.userStatus?.isSignedIn) {
      // Not signed in, can't verify
      setSolvedStatus(false);
      return;
    }

    const username = globalData.data.userStatus.username;

    // 2. Get recent AC submissions
    const recentSubRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `query getACSubmissions ($username: String!, $limit: Int) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            timestamp
          }
        }`,
        variables: { username, limit: 1 }
      })
    });

    if (!recentSubRes.ok) return;
    const recentSubData = await recentSubRes.json();

    const submissions = recentSubData?.data?.recentAcSubmissionList;
    if (submissions && submissions.length > 0) {
      const lastTimestamp = parseInt(submissions[0].timestamp, 10) * 1000;

      const now = new Date();
      //24 hours prior to now
      const startOfDay = now.getTime() - (24 * 60 * 60 * 1000);

      if (lastTimestamp >= startOfDay) {
        setSolvedStatus(true);
      } else {
        setSolvedStatus(false);
      }
    } else {
      setSolvedStatus(false);
    }

  } catch (err) {
    console.error('Error checking LeetCode status:', err);
  }
}

function setSolvedStatus(status) {
  isSolvedToday = status;
  browser.storage.local.set({ isSolvedToday: status });
}

// Listen to web requests
browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (isSolvedToday) return {};

    const url = new URL(details.url);
    const domain = url.hostname.replace(/^www\./, '');
    let isBlocked = false;

    const isAdult = adultSites.some(site => domain === site || domain.endsWith('.' + site));
    const isSocial = socialSites.some(site => domain === site || domain.endsWith('.' + site));
    const isEntertainment = entertainmentSites.some(site => domain === site || domain.endsWith('.' + site));

    if (stringencyLevel === '1') {
      isBlocked = isAdult;
    } else if (stringencyLevel === '2') {
      isBlocked = isAdult || isSocial;
    } else if (stringencyLevel === '3') {
      isBlocked = isAdult || isSocial || isEntertainment;
    } else if (stringencyLevel === '4') {
      const allowed = ['leetcode.com', 'leetcode.cn'];
      const isAllowed = allowed.some(site => domain === site || domain.endsWith('.' + site));
      // allow basic extension URLs and localhost/dev environments just in case
      if (!isAllowed && !url.protocol.startsWith('moz-extension') && !url.protocol.startsWith('chrome-extension') && domain !== 'localhost' && !domain.startsWith('127.0.0.1')) {
        isBlocked = true;
      }
    }

    if (isBlocked) {
      const blockedUrl = browser.runtime.getURL('blocked.html');
      return { redirectUrl: blockedUrl };
    }

    return {};
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
);

// Listen for manual check requests from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkStatusNow') {
    checkLeetCodeStatus().then(() => sendResponse({ success: true }));
    return true; // Keep the message channel open for async response
  }
});

init();
