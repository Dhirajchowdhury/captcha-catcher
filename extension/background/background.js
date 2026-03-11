console.log('[Captcha Catcher] Background service worker started')

// listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === 'SOLVE_CAPTCHA') {
    handleSolveCaptcha(message.payload, sendResponse)
    return true  // return true to keep the message channel open for async response
  }

  if (message.type === 'GET_STATUS') {
    chrome.storage.sync.get(['isEnabled'], (result) => {
      sendResponse({ isEnabled: result.isEnabled !== false })
    })
    return true
  }

  if (message.type === 'TOGGLE_EXTENSION') {
    chrome.storage.sync.set({ isEnabled: message.payload.isEnabled }, () => {
      sendResponse({ success: true })
    })
    return true
  }
})

const handleSolveCaptcha = async (payload, sendResponse) => {
  try {
    const response = await fetch('http://localhost:5000/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    sendResponse({ success: true, data })

  } catch (err) {
    console.error('[Captcha Catcher] Background fetch error:', err)
    sendResponse({ success: false, error: err.message })
  }
}