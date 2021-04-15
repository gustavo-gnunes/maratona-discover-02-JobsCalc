// Obs: para os arquivos funcionarem, os arquivos devem estar dentro de uma pasta chamada views

const express = require('express'); // biblioteca para criar um servidor
const routes = express.Router(); // parte do express para criar a rotas "caminhos"

// __dirname: mostra o caminho que este arquivo está
// console.log(__dirname + "/viewsindex")
const views = __dirname + "/views/" 

// isso chama Object Literal. Serve para organizar melhor o código
const Profile = {
    data: {
        name: "Gustavo",
        avatar: "https://github.com/gustavo-gnunes.png",
        // deve colocar monthly-budget entre aspas, pq tem o - no meio da palavra, se fosse escrito monthlyBudget, não precisava colocar entre aspas, igual nome e avatar que estão sem aspas
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },

    controllers: {
        index(req, res) {
            // { profile: Profile.data }: envia o objeto que foi passado em const Profile.data, podendo usar as variaveis dentro do html, no arquivo profile.ejs
            return res.render(views + "profile", { profile: Profile.data })
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

            // Profile.data: vai receber tudo que tem em Profile.data + tudo em req.body + "value-hour": valueHour
            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return res.redirect('/profile') // assim que atualizar ele redireciona para a mesma pagina no modelo get. Fica na mesma pagina
        }
    }
}

// isso chama Object Literal. Serve para organizar melhor o código
const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2, 
            "total-hours": 1,
            create_at: Date.now()
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3, 
            "total-hours": 47,
            create_at: Date.now()
        }
    ],

    controllers: {
        // req: pede algo. res: responde o que foi pedido
        index(req, res) {
            // map: parece muito com o forEach(), mas ele cria outro objeto. Serve pra qdo tem que colocar mais atributos em um objeto
            // forEach só percorre o array, o map ele consegue receber
            const updateJobs = Job.data.map((job) => {
                // ajustes no job
                // qtde de dias restantes que resta para terminar o prazo de entega do projeto
                const remaining = Job.services.remainingDays(job)
                // if "?" chegou no dia zero, é que o sistema tem que ser entrgue, venceu o prazo, então coloca done "feito"
                // senão ":" falta dias para o termino do prazo, então coloca progress
                const status = remaining <= 0 ? 'done' : 'progress'
        
                // ...job: pega tudo que está dentro do job, como id, nome, daily-hours, total-hours e create_at
                // acrescenta remaining e o status
                // retorna um novo objeto, pegando tudo que tem no jobs e acrescentando remaining e status
                return {
                    ...job,
                    remaining,
                    status,
                    // custo do projeto, valor da minha hora * total de horas que vai levar para fazer o projeto
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
            })
            
            // "index": o nome da página, não precisa colocar a extensão .ejs, pq no arquivo server.js, está sendo passado um comando: server.set('view engine', 'ejs'), que indica que estamos trabalhando com arquivos .ejs
            // jobs: o nome que está indo para usar no insdex.ejs
            return res.render(views + "index", { jobs: updateJobs })
        },
        create (req, res) {
            return res.render(views + "job")
        },
        save(req, res) {
            // req.body: onde que fica as informações preencidas pelo usuário
            // req.body: { name: 'ertewtw', 'daily-hours': '3.5', 'total-hours': '4' }
            // console.log(req.body) 

            // qdo o array Job.data estiver vazio, deve receber 0. Entra na condição || "ou"
            // qdo o array estiver algo, deve receber Job.data[Job.data.length - 1].id. Entra na condição ? "if"
            // pq se Job.data.length for 0 e subtrair com -1, vai dar -1, vai dar undefined, neste caso deve entrar na condição ||, que vai receber 0 
            const lastId = Job.data[Job.data.length - 1]?.id || 0;

            // .push: coloca dentro do array o que está vindo de req.body. Cada vez que clicar no botão salvar, é colocado os dados dentro de Job.data
            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"], // req.body["daily-hours"]: deve colocar dentro dos [], pq a palavra tem o traço
                "total-hours": req.body["total-hours"],
                create_at: Date.now() // atribuindo uma nova data, essa data vem em milesegundos
            })

            return res.redirect('/') // redirect: redireciona para pagina principal, pq está sendo passado '/', 
        },
        show(req, res) {
            // req: tras o corpo do formulário, todas informações
            // req.params: pega os parametros da url
            // req.params.id: pega o id que foi passado pela url
            // id: esse nome "id", tem que ser o mesmo que está em routes.get('/job/:id', Job.controllers.show) 
            const jobId = req.params.id
            
            // find(): parece com forEach e map
            // faz uma busca dentro do array, se encontrar algo ele retorna true
            // o jobId que vem da url, ele é uma string, então para comparar com 3 sinais de iguias "===" tem que transformar em inteiro, pois o job.id é inteiro
            const job = Job.data.find(job => Number(job.id) === Number(jobId))
            
            // entra aqui caso não encontra o job.id
            if(!job) {
                return res.send('Job not found!')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

            return res.render(views + "job-edit", {job})
        },
        update(req, res) {
            // explicação do passo a passo está na função show()
            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))

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
            Job.data = Job.data.map(job => {
                if(Number(job.id) === Number(jobId)) {
                    job = updateJob
                }

                return job
            })

            // redireciona a pagina para job-edit
            res.redirect('/job/' + jobId)
        },
        delete(req, res) {
            // explicação do passo a passo está na função show()
            const jobId = req.params.id

            // filter: parece com o forEach, map e find, só que qdo ele acha algo que está sendo procurando, ele filtra "retira"
            //  se o id for diferente, ele joga o objeto para dentro do array Job.data, qdo ele achar o id igual ao que está sendo procurado, o filter retira aquele objeto e não joga para dentro do array. Fazendo a exclusão daquele objeto
            // tudo que for verdadeiro ele vai deixar no filter, tudo que for falso ele retira "excluindo"
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            // redireciona para pagina inicial
            return res.redirect('/')
        }
    },
    
    services: {
        remainingDays(job) {
            // Obs: cada dia que passar, menos dias tem para entregar o projeto, por isso deve calcular o tempo
            // calculo de tempos restantes. 
            
            // tanto de dia que vai demorar para entregar o projeto
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed() // toFixed(): arredonda numeros float e transforma em string
            // data que foi criado o projeto
            const createdDate = new Date(job.create_at)
            // dia que o projeto vai ser entregue
            // getDate(): pega o dia do mês
            const dueDay = createdDate.getDate() + Number(remainingDays)
            // a data do vencimento. setDate(dueDay): retorna uma data em milesegundos
            const dueDateInMs = createdDate.setDate(dueDay)
            // diferença do tempo em milesegundos
            const timeDiffInMs = dueDateInMs - Date.now()
            // transformar milli em dias. Transforma um dia em milisegundos
            const dayInMs = 1000 * 60 * 60 * 24 // milli * segundos * minutos * horas
            // diferença em dias. Transforma os milesegundos em dias
            const dayDiff = Math.floor(timeDiffInMs / dayInMs) // Math.floor: arredonda o numero sempre pra baixo. Ex: 23.99, fica 23
        
            return dayDiff // qtde de dias restantes
        },
        calculateBudget: (job, valueHour) => valueHour * job["total-hours"] // qtos vai ser cobrado para fazer o projeto
    },
}


// req: pede algo. res: responde o que foi pedido
// routes.get('/', (req, res) => {
//     return res.render(__dirname + "index")
// })
// é a mesma coisa que o código a cima, porém mais curto
// get: é um método que tem dentro do express
routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)


module.exports = routes;