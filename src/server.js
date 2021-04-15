// pega o express instalado no node_modules e exporta para const express
const express = require("express")
// criar meu servidor
const server = express()

const routes = require("./routes")

// o ejs faz um processamento do html, olhando tudo que tem o contexto <% javascript %> dentro do arquivo html
// o ejs refaz todo codigo js dentro do arquivo html, entregando o html puro
// para colocar código js dentro do html, deve colocar entre <% %>
// view engine: fala para express que a ferramenta que vai ser utilizada para renderizar html é o ejs
server.set('view engine', 'ejs') // usando template engine

// habilitar arquivos staticos. Serve para criar todas as rotas que estão na pasta public
server.use(express.static("public"))

// para liberar o corpo da requisição. Usar o req.body do arquivo routes.js. Senão não tem como pegar o que o usuário digitou na pagina web
// require.body: pega o que o usuário digitou, mas precisa dessa linha de código para liberar o body
server.use(express.urlencoded({ extended: true }))

// rotas
server.use(routes)

// rodar na porta 3000
// listen: função que fica dentro do express
server.listen(3000, () => console.log('rodando'))