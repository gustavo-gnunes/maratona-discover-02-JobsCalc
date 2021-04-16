// Obs: para os arquivos funcionarem, os arquivos devem estar dentro de uma pasta chamada views

const express = require('express'); // biblioteca para criar um servidor
const routes = express.Router(); // parte do express para criar a rotas "caminhos"

const ProfileController = require('./controllers/ProfileController') // importa o arquivo ProfileController.js 
const JobController = require('./controllers/JobController')
const DashboardController = require('./controllers/DashboardController')

// __dirname: mostra o caminho que este arquivo está
// console.log(__dirname + "/viewsindex")
// const views = __dirname + "/views/" // apaguei, pois foi feito de outra forma no arquivo server.js



// req: pede algo. res: responde o que foi pedido
// routes.get('/', (req, res) => {
//     return res.render(__dirname + "index")
// })
// é a mesma coisa que o código a cima, porém mais curto
// get: é um método que tem dentro do express
routes.get('/', DashboardController.index)
routes.get('/job', JobController.create)
routes.post('/job', JobController.save)
routes.get('/job/:id', JobController.show)
routes.post('/job/:id', JobController.update)
routes.post('/job/delete/:id', JobController.delete)
routes.get('/profile', ProfileController.index)
routes.post('/profile', ProfileController.update)


module.exports = routes;