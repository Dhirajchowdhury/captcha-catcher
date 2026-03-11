// finds the input field closest to the captcha image
const findInputNearImage = (imgElement) => {
  // first look for input fields in the same parent container
  let parent = imgElement.parentElement

  // walk up 5 levels maximum looking for a nearby input
  for (let i = 0; i < 5; i++) {
    if (!parent) break

    const input = parent.querySelector('input[type="text"], input[type="number"], input:not([type])')
    if (input) return input

    parent = parent.parentElement
  }

  // fallback — just find any visible text input on the page
  const allInputs = document.querySelectorAll('input[type="text"], input[type="number"], input:not([type])')
  for (const input of allInputs) {
    if (input.offsetParent !== null) return input  // offsetParent null means hidden
  }

  return null
}

// simulates real human typing character by character
const simulateTyping = (inputElement, text) => {
  return new Promise((resolve) => {
    inputElement.focus()
    inputElement.value = ''
    let index = 0

    const typeNextChar = () => {
      if (index >= text.length) {
        // dispatch a change event after typing is done
        inputElement.dispatchEvent(new Event('change', { bubbles: true }))
        inputElement.dispatchEvent(new Event('input', { bubbles: true }))
        resolve()
        return
      }

      const char = text[index]
      inputElement.value += char

      // dispatch keyboard events to simulate real typing
      inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }))
      inputElement.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }))
      inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }))
      inputElement.dispatchEvent(new Event('input', { bubbles: true }))

      index++

      // random delay between 50ms and 150ms — mimics human typing speed
      const delay = Math.floor(Math.random() * 100) + 50
      setTimeout(typeNextChar, delay)
    }

    typeNextChar()
  })
}

// checks if an element is visible on the page
const isVisible = (element) => {
  return element &&
    element.offsetParent !== null &&
    window.getComputedStyle(element).visibility !== 'hidden' &&
    window.getComputedStyle(element).display !== 'none'
}