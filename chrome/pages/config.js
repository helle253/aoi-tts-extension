import host from '../scripts/common/host.js';

document.addEventListener('DOMContentLoaded', async () => {
  const cookie = await chrome.cookies.get({url: host, name: "openai-config"})
  if (cookie) {
    const config = JSON.parse(cookie.value || "{}");
    document.getElementById('api-key-input').value = config.apiKey;
    document.getElementById('model-input').value = config.model;
    document.getElementById('voice-input').value = config.voice;
    document.getElementById('volume-input').value = config.volume;
  }
});

function saveConfigToCookie() {
  const apiKey = document.getElementById('api-key-input').value;
  const model = document.getElementById('model-input').value;
  const voice = document.getElementById('voice-input').value;
  const volume = document.getElementById('volume-input').value;
  const config = {
    apiKey,
    model,
    voice,
    volume,
  }
  chrome.cookies.set({
    url: host,
    name: "openai-config",
    value: JSON.stringify(config),
    expirationDate: 2147483647,
  });
}

document.getElementById('button').addEventListener('click', saveConfigToCookie);
