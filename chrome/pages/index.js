document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('play').addEventListener('click', () => {
    sendMessage('play');
  });
  document.getElementById('pause').addEventListener('click', () => {
    sendMessage('pause');
  });
  document.getElementById('stop').addEventListener('click', () => {
    sendMessage('stop');
  });
});

////
// @param messageType ['play' | 'pause' | 'stop']
////
function sendMessage(messageType) {
  chrome.runtime.sendMessage({
    type: messageType,
    target: 'offscreen',
  });
}
