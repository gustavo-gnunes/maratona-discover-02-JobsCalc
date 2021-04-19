// colocar a configuração do banco de dados
// como conectar o banco com o sistema

// pega toda funcionalidade e modulos que tem dentro do sqlite3
const sqlite3 = require('sqlite3')
// pega somente a funcionalidade open de todo o modulo sqlite. O open está dentro do sqlite
const { open } = require('sqlite')


// deve colocar o open() dentro de uma estrutura de função, por isso deve fazer assim
module.exports = () => 
    // abrir a conexão com o banco de dados
    open({
        filename: 'database.sqlite', // nome do bd que será gravado as informações
        driver: sqlite3.Database // pega as informações arruma do jeito dele e passa para o filename guardar
    })
