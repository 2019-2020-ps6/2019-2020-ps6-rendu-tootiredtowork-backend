const { Router } = require('express')
const { Answer } = require('../../../../models')



const router = new Router({ mergeParams: true })

router.get('/', (req, res) => {
  try {
    
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(404).end()
    } else {
      res.status(500).json(err)
    }
  }
})
