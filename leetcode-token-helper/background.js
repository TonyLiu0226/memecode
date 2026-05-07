import { EASY_LEETCODE_UNLOCK_TIME, MEDIUM_LEETCODE_UNLOCK_TIME, HARD_LEETCODE_UNLOCK_TIME, ALARM_NAME, CHECK_INTERVAL_MINUTES } from "./constants.js";

// Compatibility layer for Chrome/Firefox
const browser = globalThis.browser || globalThis.chrome;

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
            title
            titleSlug
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
      const submission = submissions[0];
      const titleSlug = submission.titleSlug;
      const lastTimestamp = parseInt(submission.timestamp) * 1000;

      const difficulty = await fetch(`https://leetcode.com/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `query selectProblem ($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              difficulty
            }
          }`,
          variables: { titleSlug }
        })
      });
      const difficultyData = await difficulty.json();

      const now = new Date();
      let startOfDay;
      switch (difficultyData?.data?.question?.difficulty) {
        case 'Easy': //6 hours for easy
          startOfDay = now.getTime() - EASY_LEETCODE_UNLOCK_TIME;
          break;
        case 'Medium': //24 hours for medium
          startOfDay = now.getTime() - MEDIUM_LEETCODE_UNLOCK_TIME;
          break;
        case 'Hard': //72 hours for hard
          startOfDay = now.getTime() - HARD_LEETCODE_UNLOCK_TIME;
          break;
        default:
          startOfDay = now.getTime();
      }

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
