// Listen for messages from the extension
chrome.runtime.onMessage.addListener(async (msg) => {
  console.log('message received offscreen', msg.type)
  if (msg.type === 'synthesize') {
    const { text } = msg;
    console.log('synthesizing', text);
    const resp = await requestAudio(text, msg.config);
    console.log('oai response ', resp.status);
    playAudio(resp, msg.config.volume);
  };
});

async function requestAudio(text, config) {
  const { apiKey, model, voice } = config;
  return fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    body: JSON.stringify({
      model,
      voice,
      input: text,
    }),
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json",
    }
  });
}

// Play sound with access to DOM APIs
async function playAudio(response, volume) {
  const mediaSource = new MediaSource();
  const audioUrl = URL.createObjectURL(mediaSource);
  const audio = new Audio(audioUrl);
  audio.volume = volume / 100.0;
  mediaSource.addEventListener('sourceopen', async () => {
    console.log('onsourceopen');
    const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

    const reader = response.body.getReader()
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      console.log('appending');
      while (sourceBuffer.updating) { sleep(2); }
      sourceBuffer.appendBuffer(value);

      if (audio.readyState == 4) {
        audio.play();
      }
    }
  });
}
