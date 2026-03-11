const solveGridCaptcha = async (imgElement) => {
  try {
    const base64Image = await captureImageAsBase64(imgElement)

    const response = await fetch('http://localhost:5000/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64Image,
        type: 'grid',
        website: window.location.hostname
      })
    })

    const data = await response.json()

    if (!data.answer) return false

    // answer comes back as "0,2,5" — indices of tiles to click
    const indices = data.answer.split(',').map(n => parseInt(n.trim()))

    // find all grid tiles
    const tiles = imgElement.querySelectorAll('td, .rc-imageselect-tile, [class*="tile"]')

    if (tiles.length === 0) {
      console.warn('[Captcha Catcher] Could not find grid tiles')
      return false
    }

    // click each correct tile with a small delay between clicks
    for (const index of indices) {
      if (tiles[index]) {
        tiles[index].click()
        await new Promise(r => setTimeout(r, 300 + Math.random() * 200))
      }
    }

    console.log(`[Captcha Catcher] Grid captcha solved, clicked tiles: ${indices}`)
    return true

  } catch (err) {
    console.error('[Captcha Catcher] Grid captcha error:', err)
    return false
  }
}