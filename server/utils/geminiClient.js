const axios = require('axios')

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

const solveCaptcha = async (base64Image, captchaType) => {

  let prompt = ''

  if (captchaType === 'text') {
    prompt = `This is a CAPTCHA image. Read the text or numbers shown in the image exactly as they appear. Return ONLY the characters, nothing else, no explanation.`
  } else if (captchaType === 'math') {
    prompt = `This is a math CAPTCHA. Solve the mathematical expression shown in the image. Return ONLY the numerical answer, nothing else.`
  } else if (captchaType === 'grid') {
    prompt = `This is a CAPTCHA grid image. Look at the image carefully and identify which tiles contain the requested object. Return the indices of matching tiles as a comma separated list, starting from 0 at top-left, going left to right.`
  }

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: 'image/png',
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      }
    ]
  }

  const response = await axios.post(GEMINI_URL, requestBody)
  const answer = response.data.candidates[0].content.parts[0].text.trim()
  return answer
}

module.exports = { solveCaptcha }