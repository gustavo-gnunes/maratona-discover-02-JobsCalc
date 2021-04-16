const Job = require('../model/Job') // importa o aqruivo Job.js
const JobUtils = require('../utils/JobUtils') // importa o aqruivo jobUtils.js
const Profile = require('../model/Profile') // importa o aqruivo Profile.js

module.exports = {
    // req: pede algo. res: responde o que foi pedido
    create (req, res) {
        return res.render("job")
    },
    save(req, res) {
        const jobs = Job.get()

        // req.body: onde que fica as informações preencidas pelo usuário
        // req.body: { name: 'ertewtw', 'daily-hours': '3.5', 'total-hours': '4' }
        // console.log(req.body) 

        // qdo o array jobs que está no arquivo Job.js estiver vazio, deve receber 0. Entra na condição || "ou"
        // qdo o array estiver algo, deve receber jobs[jobs.length - 1].id. Entra na condição ? "if"
        // pq se jobs.length for 0 e subtrair com -1, vai dar -1, vai dar undefined, neste caso deve entrar na condição ||, que vai receber 0 
        const lastId = jobs[jobs.length - 1]?.id || 0;

        // .push: coloca dentro do array o que está vindo de req.body. Cada vez que clicar no botão salvar, é colocado os dados dentro de jobs, que está dentro do arquivo Job.js
        jobs.push({
            id: lastId + 1,
            name: req.body.name,
            "daily-hours": req.body["daily-hours"], // req.body["daily-hours"]: deve colocar dentro dos [], pq a palavra tem o traço
            "total-hours": req.body["total-hours"],
            create_at: Date.now() // atribuindo uma nova data, essa data vem em milesegundos
        })

        return res.redirect('/') // redirect: redireciona para pagina principal, pq está sendo passado '/', 
    },
    show(req, res) {
        const jobs = Job.get()
        const profile = Profile.get()

        // req: tras o corpo do formulário, todas informações
        // req.params: pega os parametros da url
        // req.params.id: pega o id que foi passado pela url
        // id: esse nome "id", tem que ser o mesmo que está em routes.get('/job/:id', Job.controllers.show) 
        const jobId = req.params.id
        
        // find(): parece com forEach e map
        // faz uma busca dentro do array, se encontrar algo ele retorna true
        // o jobId que vem da url, ele é uma string, então para comparar com 3 sinais de iguias "===" tem que transformar em inteiro, pois o job.id é inteiro
        const job = jobs.find(job => Number(job.id) === Number(jobId))
        
        // entra aqui caso não encontra o job.id
        if(!job) {
            return res.send('Job not found!')
        }

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

        return res.render("job-edit", {job})
    },
    update(req, res) {
        const jobs = Job.get()

        // explicação do passo a passo está na função show()
        const jobId = req.params.id

        const job = jobs.find(job => Number(job.id) === Number(jobId))

        if(!job) {
            return res.send('Job not found!')
        }

        // alterar dados do Job. Coloca dentro do updateJob os novos dados
        const updateJob = {
            ...job, // passa tudo que está em job
            name: req.body.name, // sobrescreve o name, para o nome que está na tela do usuário na pagina job-edit
            "total-hours": req.body["total-hours"], // sobrescreve o total-hours, igual o name
            "daily-hours": req.body["daily-hours"], // sobrescrve o daily-hours, igual o name
        }

        // alterar os dados do job. 
        // busca pelo id quais são os dados que vão ser alterados e coloca dentro do job, os dados atualizados
        const newJobs = jobs.map(job => {
            if(Number(job.id) === Number(jobId)) {
                job = updateJob
            }

            return job
        })

        // serve para alterar os dados do arquivo Job.js
        Job.update(newJobs)

        // redireciona a pagina para job-edit
        res.redirect('/job/' + jobId)
    },
    delete(req, res) {
        //const jobs = Job.get()

        // explicação do passo a passo está na função show()
        const jobId = req.params.id

        // filter: parece com o forEach, map e find, só que qdo ele acha algo que está sendo procurando, ele filtra "retira"
        //  se o id for diferente, ele joga o objeto para dentro do array Job.data, qdo ele achar o id igual ao que está sendo procurado, o filter retira aquele objeto e não joga para dentro do array. Fazendo a exclusão daquele objeto
        // tudo que for verdadeiro ele vai deixar no filter, tudo que for falso ele retira "excluindo"
        //Job.data = jobs.filter(job => Number(job.id) !== Number(jobId)) // não precisa mais desta função, pois essa linha de código vai ficar dentro de uma função delete(), dentro do arquivo Job.js

        // passa para função delete que está dentro do arquivo Job.js, o parametro jobId que tem que excluir  
        Job.delete(jobId)

        // redireciona para pagina inicial
        return res.redirect('/')
    }
}
