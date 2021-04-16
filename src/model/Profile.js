// este arquivo serve para retornar dados
// deve ser let, pq na função update() ele altera os dados do data, se for const, não tem com alterar, pq o const não deixa
let data = {
    name: "Gustavo",
    avatar: "https://github.com/gustavo-gnunes.png",
    // deve colocar monthly-budget entre aspas, pq tem o - no meio da palavra, se fosse escrito monthlyBudget, não precisava colocar entre aspas, igual nome e avatar que estão sem aspas
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75
}

module.exports = {
    get() {
        return data
    },
    // altera os dados que estão vindo do arquivo ProfileContrller.js
    update(newData) {
        data = newData
    }
}