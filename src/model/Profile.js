// tudo que está na pasta model é onde deve ficar os dados, é responsável para editar e alterar os dados
// este arquivo serve para retornar dados

const Database = require('../db/config') // importar o arquivo config.js


// está comentado pq não vou colocar os dados mais aqui, pois vai ser usado o BD para inserir os dados
// // deve ser let, pq na função update() ele altera os dados do data, se for const, não tem com alterar, pq o const não deixa
// let data = {
//     name: "Gustavo",
//     avatar: "https://github.com/gustavo-gnunes.png",
//     // deve colocar monthly-budget entre aspas, pq tem o - no meio da palavra, se fosse escrito monthlyBudget, não precisava colocar entre aspas, igual nome e avatar que estão sem aspas
//     "monthly-budget": 3000,
//     "days-per-week": 5,
//     "hours-per-day": 5,
//     "vacation-per-year": 4,
//     "value-hour": 75
// }

module.exports = {
    // async / await: comando do javascript. O await só funciona se ele estiver dentro do async 
    // async: tudo que estiver dentro dele vai ter que esperar. Ele fala para o js que dentro da função vão ter await
    async get() {
        // iniciar o BD
        // await: espera algo ser executado para depois executar outra
        // await: espera o Database terminar de inicializar, para depois executar db.get, depois espera executar db.get para executar o db.close
        const db = await Database()

        // .get: tras somente um dado. Como no profile tem somente um, pode usar o .get, já no job é de outro jeito, pois tem mais de um job que vai ser cadastrado
        const data = await db.get(`SELECT * FROM profile`)

        // fechar a conexão do BD
        await db.close()

        // como o sistema inteiro foi colocado as variaveis com traço Ex: monthly-budget e o BD só aceita com underlaine "monthly_budget" . tem que fazer a linha abaixo
        // Ou faz a linha abaixo ou muda todas as variaveis do projeto inteiro para underlaine "monthly_budget", do jeito que está no BD
        // data: é o que está vindo do BD
        // Obs: se as variaveis do projeto estiver do mesmo jeito que do BD é só returnar o data, como neste caso não está, deve fazer assim
        return {
            name: data.name,
            avatar: data.avatar,
            "monthly-budget": data.monthly_budget, // pega a variavel data.monthly_budget que está vindo do BD e coloca para variavel monthly-budget-> que é o mesmo nome da variavel do projeto 
            "days-per-week": data.days_per_week,
            "hours-per-day": data.hours_per_day,
            "vacation-per-year": data.vacation_per_year,
            "value-hour": data.value_hour
        }
    },
    // altera os dados que estão vindo do arquivo ProfileContrller.js
    async update(newData) {
        // iniciar o BD
        const db = await Database()

        // newData: toas informações que está vindo do projeto, para alterar no BD
        // ${}: serve para colocar variaveis do js dentro do sql
        // name = "${newData.name}": tem que colocar entre "", pq esse campo é string
        db.run(`UPDATE profile SET
        name = "${newData.name}", 
        avatar = "${newData.avatar}", 
        monthly_budget = ${newData["monthly-budget"]},
        days_per_week = ${newData["days-per-week"]},
        hours_per_day = ${newData["hours-per-day"]},
        vacation_per_year = ${newData["vacation-per-year"]},
        value_hour = ${newData["value-hour"]}
        `)

        await db.close()
    }
}