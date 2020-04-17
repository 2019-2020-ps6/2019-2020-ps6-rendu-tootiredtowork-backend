const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('Theme', {
	id:Joi.string().required(),
	quizs:Joi.array().items(Joi.object({
  		id: Joi.string().required(),
  		difficulty: Joi.number().integer(),
  		questions: Joi.array().items(Joi.object({
    		label: Joi.string().required(),
    		answers: Joi.array().items(Joi.object({
      			value: Joi.string().required(),
      			isCorrect: Joi.boolean(),
    		})),
  		})),
	})),
})
