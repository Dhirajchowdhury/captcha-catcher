const { solveCaptcha } = require('../utils/geminiClient')
const SolveLog = require('../models/solveLog')

const solve = async (req, res) => {
  const { image, type, website } = req.body

  if (!image || !type || !website) {
    return res.status(400).json({ error: 'image, type and website are required' })
  }

  const startTime = Date.now()

  try {
    const answer = await solveCaptcha(image, type)
    const timeTaken = Date.now() - startTime

    await SolveLog.create({
      type,
      website,
      success: true,
      timeTaken,
      answer
    })

    return res.status(200).json({ answer, timeTaken })

  } catch (err) {
    const timeTaken = Date.now() - startTime

    await SolveLog.create({
      type,
      website,
      success: false,
      timeTaken,
      answer: null
    })

    console.error('Solve error:', err)
    return res.status(500).json({ error: 'Failed to solve captcha' })
  }
}

module.exports = { solve }