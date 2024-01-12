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
  const arrayBuffer = await response.arrayBuffer();
  const audioBlob = new Blob([arrayBuffer], { type: 'audio/mp3' });
  // Create a URL for the Blob
  const audioUrl = URL.createObjectURL(audioBlob);
  // Create an audio element and set its source to the blob URL
  const audio = new Audio(audioUrl);
  audio.volume = volume / 100.0;

  audio.play();
}
