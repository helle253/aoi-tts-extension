import { setupOffscreenDocument } from './scripts/common/setupOffscreenDocument.js';
import host from './scripts/common/host.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(
    {
      title: "Synthesize",
      contexts: ['selection'],
      id: 'selection',
    }
  );
});

function init() {
  chrome.contextMenus.onClicked.addListener(async (context, _) => {
    const cookie = await chrome.cookies.get({url: host, name: "openai-config"})
    const config = JSON.parse(cookie.value || "{}");

    await setupOffscreenDocument('pages/offscreen.html');

    await chrome.runtime.sendMessage({
      type: 'synthesize',
      target: 'offscreen',
      text: context.selectionText,
      config,
    });
  });
}


init();
