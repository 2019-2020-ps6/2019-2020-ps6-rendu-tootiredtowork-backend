const { Router } = require('express')

const { Quiz } = require('../../models')
const manageAllErrors = require('../../utils/routes/error-management')
const QuestionsRouter = require('./questions')

const router = new Router()


router.get('/', (req, res) => {
  try {
    res.status(200).json(Quiz.get())
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/theme/:id', (req, res) => {
  try {
    res.status(200).json(Quiz.getTheme(req.params.id))
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/themequiz/:id', (req, res) => {
  try {
    res.status(200).json(Quiz.getQuizzes(req.params.id))
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/:theme/:id', (req, res) => {
  try {
    res.status(200).json(Quiz.getQuiz(req.params.theme,req.params.id))
  } catch (err) {
    res.status(500).json(err)
  }
})



router.post('/:theme/:id', (req, res) => {
  try {
    const quiz = Quiz.update(req.params.theme,req.params.id,{ ...req.body })
    res.status(201).json(quiz)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra)
    } else {
      res.status(500).json(err)
    }
  }
})




router.put('/:id', (req, res) => {
  try {
    res.status(200).json(Quiz.update(req.params.id, req.body))
  } catch (err) {
    manageAllErrors(res, err)
  }
})


router.delete('/:theme/:id', (req, res) => {
  try {
    Quiz.deleteQuiz(req.params.theme,req.params.id)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
