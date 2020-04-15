const { Router } = require('express')

const { Quiz } = require('../../models')
const { Question } = require('../../models')
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

router.get('/:id', (req, res) => {
  try {
    res.status(200).json(Quiz.getById(req.params.id))
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/:id', (req, res) => {
  try {
    const quiz = Quiz.update(req.params.id,{ ...req.body })
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


router.delete('/:id', (req, res) => {
  try {
    Quiz.delete(req.params.id)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
