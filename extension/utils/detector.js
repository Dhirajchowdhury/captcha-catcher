// keywords that strongly suggest a captcha is nearby
const CAPTCHA_KEYWORDS = [
  'captcha', 'recaptcha', 'hcaptcha', 'verification',
  'verify', 'security code', 'securitycode', 'securimage',
  'bot', 'human', 'challenge'
]

// checks if a string contains any captcha keywords
const containsCaptchaKeyword = (str) => {
  if (!str) return false
  const lower = str.toLowerCase()
  return CAPTCHA_KEYWORDS.some(keyword => lower.includes(keyword))
}

// checks if an element has captcha-related attributes
const hasCaptchaAttributes = (element) => {
  return (
    containsCaptchaKeyword(element.id) ||
    containsCaptchaKeyword(element.className) ||
    containsCaptchaKeyword(element.alt) ||
    containsCaptchaKeyword(element.name) ||
    containsCaptchaKeyword(element.getAttribute('aria-label'))
  )
}

// detects what type of captcha is present on the page
const detectCaptchaType = () => {

  // check for recaptcha iframe first
  const recaptchaFrame = document.querySelector('iframe[src*="recaptcha"], iframe[title*="recaptcha" i]')
  if (recaptchaFrame) {
    return { type: 'recaptcha', element: recaptchaFrame }
  }

  // check for hcaptcha
  const hcaptchaFrame = document.querySelector('iframe[src*="hcaptcha"]')
  if (hcaptchaFrame) {
    return { type: 'hcaptcha', element: hcaptchaFrame }
  }

  // check for math captcha in plain text
  const bodyText = document.body.innerText
  const mathPattern = /what\s+is\s+\d+\s*[\+\-\*x]\s*\d+/i
  if (mathPattern.test(bodyText)) {
    return { type: 'math-text', element: null }
  }

  // look for captcha images
  const images = document.querySelectorAll('img')
  for (const img of images) {
    if (hasCaptchaAttributes(img) && isVisible(img)) {
      // check if it looks like a grid (wider than tall suggests grid)
      const ratio = img.naturalWidth / img.naturalHeight
      if (ratio > 2) {
        return { type: 'grid', element: img }
      }
      return { type: 'text', element: img }
    }
  }

  // look for captcha inside divs — some captchas render as canvas or div
  const allElements = document.querySelectorAll('[id*="captcha"], [class*="captcha"], [id*="verify"], [class*="verify"]')
  for (const el of allElements) {
    if (isVisible(el)) {
      const img = el.querySelector('img')
      if (img) return { type: 'text', element: img }
    }
  }

  return null  // no captcha found
}