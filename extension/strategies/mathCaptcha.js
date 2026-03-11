const solveMathCaptcha = async () => {
  const bodyText = document.body.innerText

  // pattern to find math expressions like "What is 4 + 7?"
  const mathPattern = /(\d+)\s*([\+\-\*x\/])\s*(\d+)/i
  const match = bodyText.match(mathPattern)

  if (!match) return false

  const num1 = parseInt(match[1])
  const operator = match[2]
  const num2 = parseInt(match[3])

  let answer
  if (operator === '+') answer = num1 + num2
  else if (operator === '-') answer = num1 - num2
  else if (operator === '*' || operator === 'x') answer = num1 * num2
  else if (operator === '/') answer = Math.floor(num1 / num2)

  if (answer === undefined) return false

  // find the input and fill it
  const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input:not([type])')
  for (const input of inputs) {
    if (isVisible(input)) {
      await simulateTyping(input, answer.toString())
      console.log(`[Captcha Catcher] Math solved locally: ${num1} ${operator} ${num2} = ${answer}`)
      return true
    }
  }

  return false
}