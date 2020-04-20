/* eslint-disable no-param-reassign */
const fs = require('fs')
const Joi = require('joi')
const logger = require('../utils/logger.js')
const ValidationError = require('./errors/validation-error.js')
const NotFoundError = require('./errors/not-found-error.js')

module.exports = class BaseModel {
  constructor(name, schema) {
    if (!name) throw new Error('You must provide a name in constructor of BaseModel')
    if (!schema) throw new Error('You must provide a schema in constructor of BaseModel')
    this.schema = Joi.object().keys({ ...schema })
    this.items = []
    this.name = name
    this.filePath = `${__dirname}/../../mocks/${this.name.toLowerCase()}.mocks.json`
    this.load()
    this.filePath = `${__dirname}/../../mocks/${this.name.toLowerCase()}.test.json`
  }

  load() {
    try {
      this.items = JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
    } catch (err) {
      if (err.message === 'Unexpected end of JSON input') logger.log(`Warning : ${this.filePath} has wrong JSON format`)
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.items, null, 2), 'utf8')
    } catch (err) {
      logger.log(`Error while trying to save ${this.name}`)
    }
  }

  get() {
    return this.items
  }

  getTheme(id) {
    const item = this.items.find((i) => i.id === id)
    if (!item) throw new NotFoundError(`Cannot get ${this.name} id=${id} : not found`)
    return item
  }

  getQuizzes(id) {
    const item = this.items.find((i) => i.id === id)
    if (!item) throw new NotFoundError(`Cannot get ${this.name} id=${id} : not found`)
    return item.quizs
  }

  getQuiz(theme,id) {
    const item = this.items.find((i) => i.id === theme)
    if (!item) throw new NotFoundError(`Cannot get ${this.name} id=${id} : not found`)
    const quiz= item.quizs.find((i) => i.id === id)
    return quiz
  }
  
  create(obj = {}) {
    const item = { ...obj }
    const { error } = Joi.validate(item, this.schema)
    if (error) throw new ValidationError(`Create Error : Object ${JSON.stringify(obj)} does not match schema of model ${this.name}`, error)
    this.items.push(item)
    this.save()
    return item
  }

  update(theme,id, obj) {
    //theme
    const prevObjIndexTheme = this.items.findIndex((item) => item.id === theme)
    if (prevObjIndexTheme === -1) throw new NotFoundError(`Cannot update ${this.name} id=${theme} : not found`)

    const Theme = this.items.find((i) => i.id === theme)

    //quiz
    const prevObjIndexQuiz = Theme.quizs.findIndex((item) => item.id === id)
    if (prevObjIndexQuiz === -1) throw new NotFoundError(`Cannot update ${this.name} id=${id} : not found`)
    
    const updatedItem = { ...this.items[prevObjIndexTheme].quizs[prevObjIndexQuiz], ...obj }
    const { error } = Joi.validate(updatedItem, this.schema)
    if (error) throw new ValidationError(`Update Error : Object ${JSON.stringify(obj)} does not match schema of model ${this.name}`, error)
    this.items[prevObjIndexTheme].quizs[prevObjIndexQuiz] = updatedItem
    this.save()
    return updatedItem
  }
  
  deleteQuiz(theme,id) {
    const objIndex = this.items.findIndex((item) => item.id === theme)
    if (objIndex === -1) throw new NotFoundError(`Cannot delete ${this.name} theme=${theme} : not found`)

    const Theme = this.items.find((i) => i.id === theme)

    const prevObjIndexQuiz = Theme.quizs.findIndex((item) => item.id === id)
    if (prevObjIndexQuiz === -1) throw new NotFoundError(`Cannot delete ${this.name} id=${id} : not found`)
    this.items[objIndex].quizs = this.items[objIndex].quizs.filter((item) => item.id !== id)
    this.save()
  }

  addQuiz(theme, obj) {
    console.log("eeeeeeeeeeeeeee");
    const objIndex = this.items.findIndex((item) => item.id === theme)
    if (objIndex === -1) throw new NotFoundError(`Cannot delete ${this.name} theme=${theme} : not found`)

   const Theme = this.items.find((i) => i.id === theme)
  console.log(obj);
  this.items[objIndex].quizs.push(obj)
  }

  deleteQuestion(theme,id,label) {

    const objIndex = this.items.findIndex((item) => item.id === theme)
    if (objIndex === -1) throw new NotFoundError(`Cannot delete ${this.name} theme=${theme} : not found`)
    const Theme = this.items.find((i) => i.id === theme)

    const prevObjIndexQuiz = Theme.quizs.findIndex((item) => item.id === id)
    if (prevObjIndexQuiz === -1) throw new NotFoundError(`Cannot delete ${this.name} quiz=${id} : not found`)
    const Quiz = Theme.quizs.find((i) => i.id === id)
    const prevObjIndexQuestion = Quiz.questions.findIndex((item) => item.label === label)
    if (prevObjIndexQuiz === -1) throw new NotFoundError(`Cannot delete ${this.name} label=${label} : not found`)
    this.items[objIndex].quizs[prevObjIndexQuiz].questions = this.items[objIndex].quizs[prevObjIndexQuiz].questions.filter((item) => item.label !== label)
    this.save()
  }

    deleteTheme(theme) {

    const objIndex = this.items.findIndex((item) => item.id === theme)
     console.log(objIndex)
    if (objIndex === -1) throw new NotFoundError(`Cannot delete ${this.name} theme=${theme} : not found`)
    this.items = this.items.filter((item) => item.id !== theme)
    this.save()
  }
}
