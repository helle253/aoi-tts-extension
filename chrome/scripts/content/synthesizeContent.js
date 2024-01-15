async function synthesizeContent() {
  const text =  window.getSelection().toString();
  // Send message to offscreen document
  await chrome.runtime.sendMessage({
    type: 'init-synthesize',
    text,
  });
}

synthesizeContent();
