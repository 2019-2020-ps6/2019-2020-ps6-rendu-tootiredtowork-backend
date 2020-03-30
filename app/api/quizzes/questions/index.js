const { Router } = require('express')

const { Question } = require('../../../models')
const manageAllErrors = require('../../../utils/routes/error-management')
const { filterQuestionsFromQuizz } = require('./manager')

const router = new Router({ mergeParams: true })

router.get('/', (req, res) => {
  try {

    Quiz.getById(req.params.id)
    res.status(200).json(filterQuestionsFromQuizz(req.params.id))
    
  } catch (err) {
    manageAllErrors(res, err)
  }
})
