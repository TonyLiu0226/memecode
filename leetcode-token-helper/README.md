# LeetCode Token Helper (Firefox)

This Firefox extension reads your LeetCode cookies (LEETCODE_SESSION and csrftoken) and displays them for copy/paste into the app.

## Temporary Install

1. Open Firefox → about:debugging#/runtime/this-firefox
2. Click "Load Temporary Add-on..."
3. Select this folder's manifest.json
4. Ensure you're logged in at https://leetcode.com/ (or https://leetcode.cn/)
5. Click the toolbar icon → copy the tokens

Notes:
- Permissions include both leetcode.com and leetcode.cn.
- Tokens are not stored; they appear only in the popup while open.

## Packaging
No build step. For signing/publishing, see Mozilla Add-ons docs.




