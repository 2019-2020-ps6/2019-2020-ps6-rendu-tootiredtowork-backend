const { Answer } = require('../../../../models')




const filterAnswersFromQuestion = (questionId) => {
    return Answer.get().filter((answer) => (answer.questionId === questionId))
}
