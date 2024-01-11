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

  initializeListeners();
});

chrome.runtime.onStartup.addListener(initializeListeners);

function initializeListeners() {
  chrome.runtime.onMessage.addListener(async (msg, _, __) => {
    if (msg.type === 'init-synthesize') {
      const cookie = await chrome.cookies.get({url: host, name: "openai-config"})
      if (cookie) {
        const config = JSON.parse(cookie.value || "{}");
        await setupOffscreenDocument('pages/offscreen.html');

        // Send message to offscreen document
        await chrome.runtime.sendMessage({
          type: 'synthesize',
          target: 'offscreen',
          text: msg.text,
          config,
        });
      }
    }
  });

  chrome.contextMenus.onClicked.addListener(async (_, tab) => {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./scripts/content/synthesizeContent.js'],
    });
  });
}
