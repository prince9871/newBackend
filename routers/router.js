const Express=require('express')
const Router=Express.Router()
const createController=require('../controllers/createController')
Router.get('/api', (req, res) => {

  return res.send({ message: 'hello from api' })
})
// Router.post('/dataSendApi',createController.dbApiSend)
Router.post('/dataCreate', createController.dbCreate)
Router.post('/api/messages', createController.dbApiMessages) 
// Router.get('/dataGet', createController.dbGet)
// Router.post('/user-input', createController.handleUserInput);

module.exports = Router

