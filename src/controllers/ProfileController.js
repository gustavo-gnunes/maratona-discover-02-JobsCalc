const Profile = require('../model/Profile') // importa o arquivo Profile.js

// module.exports: é necessario, pq senão não tem como importar esse arquivo no arquivo routes.js
// precisa ser exportado para usar as funções que estão aqui dentro deste arquivo
module.exports = {
    index(req, res) {
        // { profile: Profile.get() }: envia o objeto que foi passado no arquivo Profile.js, podendo usar as variaveis dentro do html, no arquivo profile.ejs
        return res.render("profile", { profile: Profile.get() })
    },
    update(req, res) {
        // req.body: onde que fica as informações preencidas pelo usuário
        // req.body: para pegar os dados
        const data = req.body
        // definir qtas semanas tem em um ano: 52
        const weeksPerYear = 52
        // remover as semanas de ferias do ano, para pegar qtas semanas tem em 1 mês
        const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12
        // total de horas trabalhadas na semana
        const weekTotalHours = data["hours-per-day"] * data["days-per-week"]
        // horas trabalhadas no mês
        const monthlyTotalHours = weekTotalHours * weeksPerMonth
        // qual será o valor da minha horas
        const valueHour = data["monthly-budget"] / monthlyTotalHours

        // Profile.update: vai receber tudo que tem em Profile.get() + tudo em req.body + "value-hour": valueHour
        // Profile.update: ele vai chamar essa função que está dentro do arquivo Profile.js, e atualizar os dados alterados
        Profile.update({
            ...Profile.get(),
            ...req.body,
            "value-hour": valueHour
        })

        return res.redirect('/profile') // assim que atualizar ele redireciona para a mesma pagina no modelo get. Fica na mesma pagina
    }
}