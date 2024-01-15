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
  chrome.contextMenus.onClicked.addListener(async (_, tab) => {

    chrome.runtime.onMessage.addListener(listener);

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./scripts/content/synthesizeContent.js'],
    });
  });
}

async function listener(msg, _, __) {
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
};

init();
