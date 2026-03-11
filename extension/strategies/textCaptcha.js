const solveTextCaptcha = async (imgElement) => {
  try {
    // capture the image as base64
    const base64Image = await captureImageAsBase64(imgElement)

    // send to our backend server
    const response = await fetch('http://localhost:5000/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64Image,
        type: 'text',
        website: window.location.hostname
      })
    })

    const data = await response.json()

    if (!data.answer) {
      console.error('[Captcha Catcher] No answer received')
      return false
    }

    // find the nearest input field and fill it
    const input = findInputNearImage(imgElement)
    if (!input) {
      console.error('[Captcha Catcher] Could not find input field')
      return false
    }

    await simulateTyping(input, data.answer)
    console.log(`[Captcha Catcher] Text captcha solved in ${data.timeTaken}ms: ${data.answer}`)
    return true

  } catch (err) {
    console.error('[Captcha Catcher] Text captcha error:', err)
    return false
  }
}