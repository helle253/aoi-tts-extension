// Listen for messages from the extension
chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === 'synthesize') {
    const { text } = msg;
    const resp = await requestAudio(text, msg.config);
    playAudio(resp, msg.config.volume);
  } else if (msg.type === 'play') {
    audio?.play();
  } else if (msg.type === 'pause' || msg.type === 'stop') {
    audio?.pause();
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
  audio = new Audio(audioUrl);
  audio.volume = volume / 100.0;
  audio.play();
  mediaSource.addEventListener('sourceopen', async () => {
    const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

    const reader = response.body.getReader()
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      while (sourceBuffer.updating) { sleep(2); }
      sourceBuffer.appendBuffer(value);

      if (audio.readyState == 4 && !audio.paused && !audio.ended) {
        audio.play();
      }
    }
  });
}
