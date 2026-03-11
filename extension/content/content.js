console.log('[Captcha Catcher] Content script loaded')

// how long to wait before trying again after a failed attempt
const RETRY_DELAY = 3000
// how long to wait before scanning again after solving
const RESCAN_DELAY = 2000

let isSolving = false

const trySolveCaptcha = async () => {
  if (isSolving) return
  isSolving = true

  try {
    const detected = detectCaptchaType()

    if (!detected) {
      isSolving = false
      return
    }

    console.log(`[Captcha Catcher] Detected captcha type: ${detected.type}`)

    let solved = false

    if (detected.type === 'math-text') {
      solved = await solveMathCaptcha()
    } else if (detected.type === 'text') {
      solved = await solveTextCaptcha(detected.element)
    } else if (detected.type === 'grid') {
      solved = await solveGridCaptcha(detected.element)
    } else if (detected.type === 'recaptcha' || detected.type === 'hcaptcha') {
      console.log('[Captcha Catcher] reCAPTCHA/hCaptcha detected — advanced solving coming soon')
    }

    if (solved) {
      console.log('[Captcha Catcher] Successfully solved!')
    } else {
      console.warn('[Captcha Catcher] Could not solve, will retry...')
      setTimeout(trySolveCaptcha, RETRY_DELAY)
    }

  } catch (err) {
    console.error('[Captcha Catcher] Unexpected error:', err)
  } finally {
    isSolving = false
  }
}

// MutationObserver — watches for any new elements appearing on the page
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === 1) {  // nodeType 1 means it's an element
        // check if the new element looks like a captcha
        const html = node.outerHTML || ''
        if (html.toLowerCase().includes('captcha') ||
            html.toLowerCase().includes('verify') ||
            html.toLowerCase().includes('challenge')) {
          setTimeout(trySolveCaptcha, 500)  // small delay to let it fully render
          return
        }
      }
    }
  }
})

// start observing the entire page for any DOM changes
observer.observe(document.body, {
  childList: true,    // watch for elements being added or removed
  subtree: true       // watch all descendants not just direct children
})

// also run once immediately when page loads
// in case captcha is already present on page load
setTimeout(trySolveCaptcha, 1000)
