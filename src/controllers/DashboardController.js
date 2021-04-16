const Job = require('../model/Job') // importa o arquivo Job.js
const JobUtils = require('../utils/JobUtils') // importa o arquivo JobUtils.js
const Profile = require('../model/Profile') // importa o arquivo Profile.js

module.exports = {
    // req: pede algo. res: responde o que foi pedido
    index(req, res) {
        const jobs = Job.get() // pega todo array em Job.js
        const profile = Profile.get()

        // para calcular e mostrar para usuário final na tela principal "index.ejs" os Projetos ao total, Em andamento, Encerrados
        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length // para ter o total de jobs
        }

        // total de horas por dia de cada Job em progress. 
        let jobTotalHours = 0

        // map: parece muito com o forEach(), mas ele cria outro objeto. Serve pra qdo tem que colocar mais atributos em um objeto
        // forEach só percorre o array, o map ele consegue receber
        const updateJobs = jobs.map((job) => {
            // ajustes no job
            // qtde de dias restantes que resta para terminar o prazo de entega do projeto
            const remaining = JobUtils.remainingDays(job)
            // if "?" chegou no dia zero, é que o sistema tem que ser entregue, venceu o prazo, então coloca done "feito"
            // senão ":" falta dias para o termino do prazo, então coloca progress
            const status = remaining <= 0 ? 'done' : 'progress'

            // total de horas por dia de cada Job em progress. Não entra os Job em done, pq se está feito, não está mais trabalhando naquele projeto
            // está linha é a mesma coisa que o if logo abaixo que está em comentário
            jobTotalHours = status === 'progress' ?  jobTotalHours + Number(job['daily-hours']) : jobTotalHours
           
            // if(status === 'progress') {
            //     jobTotalHours += Number(job['daily-hours'])
            // }

            // por causa do map, ele está percorrendo todo array do jobs
            // statusCount[status] += 1: pega o coteudo que tem essa variável status e soma + 1
            // Ex: status = done // statusCount[done] += 1
            // qdo o status for done, ele coloca +1 na variavel statusCount.done
            // qdo o status for progress, ele coloca +1 na variavel statusCount.progress
            // Soma a qtde de status
            // consegue contar qtos done e qtos progress tem
            // statusCount[status] += 1 // statusCount na posição status "done ou progress", vai receber o que tem + 1
            statusCount[status] += 1

            // ...job: pega tudo que está dentro do job, como id, nome, daily-hours, total-hours e create_at
            // acrescenta remaining e o status
            // retorna um novo objeto, pegando tudo que tem no jobs e acrescentando remaining e status
            return {
                ...job,
                remaining,
                status,
                // custo do projeto, valor da minha hora * total de horas que vai levar para fazer o projeto
                // dentro do arquivo jobUtils.js tem uma função chamada calculateBudget
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            }
        })

        // calcula o numero de horas livres
        // qtde de horas que quero trabalhar dia (profile) - qtde de horas/dia de cada job em progress 
        const freeHours = profile["hours-per-day"] - jobTotalHours;
        
        // "index": o nome da página, não precisa colocar a extensão .ejs, pq no arquivo server.js, está sendo passado um comando: server.set('view engine', 'ejs'), que indica que estamos trabalhando com arquivos .ejs
        // jobs: o nome que está indo para usar no index.ejs
        // profile: o nome que está indo para usar no index.ejs
        // "index", { jobs: updateJobs, profile }: da para usar na pagina index, tudo que está dentro da variavel jobs e profile
        return res.render("index", { jobs: updateJobs, profile, statusCount, freeHours })
    }
}

