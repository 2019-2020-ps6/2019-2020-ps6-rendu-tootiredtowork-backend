const { Quiz, Question } = require('../../../models')


const filterQuestionsFromQuizz = (quizId) => {
    const questions = Question.get()
    const parsedId = parseInt(quizId, 10)
    return questions.filter((question) => question.quizId === parsedId)
}



module.exports = {
    filterQuestionsFromQuizz
    
}