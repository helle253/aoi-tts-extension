async function synthesizeContent() {
  const text =  window.getSelection().toString();
  // Send message to offscreen document
  console.log('starting request in content script', text);
  await chrome.runtime.sendMessage({
    type: 'init-synthesize',
    text,
  });
}

synthesizeContent();
