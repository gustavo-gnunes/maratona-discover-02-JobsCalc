// tudo que está na pasta model é onde deve ficar os dados, é responsável para editar e alterar os dados

const Database = require('../db/config') // importar o arquivo config.js

// está comentado pq não vou colocar os dados mais aqui, pois vai ser usado o BD para inserir os dados
// let data = [
//     {
//         id: 1,
//         name: "Pizzaria Guloso",
//         "daily-hours": 2, 
//         "total-hours": 1,
//         create_at: Date.now()
//     },
//     {
//         id: 2,
//         name: "OneTwo Project",
//         "daily-hours": 3, 
//         "total-hours": 47,
//         create_at: Date.now()
//     }
// ];

module.exports = {
    async get() {
        // iniciar o BD
        const db = await Database()

        // .all: para trazer tudo que está na tabela jobs, se colocar .get: só vai trazer um elemento da tabela
        const jobs = await db.all(`SELECT * FROM jobs`)

        // fechar a conexão do BD
        await db.close()

        // como o sistema inteiro foi colocado as variaveis com traço Ex: daily-hours e o BD só aceita com underlaine "daily-hours" . tem que fazer a linha abaixo
        // Ou faz a linha abaixo ou muda todas as variaveis do projeto inteiro para underlaine "daily-hours", do jeito que está no BD
        // data: é o que está vindo do BD
        // Obs: se as variaveis do projeto estiver do mesmo jeito que do BD é só returnar o jobs, como neste caso não está, deve fazer assim
        // tem que usar o map, pq nesta tabela jobs tem mais de um elemento "objeto". Ex: Tem varias job cadastrados
        return jobs.map(job => ({
            // isso, retorna para o map e o map retorna para o return de cima
            id: job.id,
            name: job.name,
            "daily-hours": job.daily_hours,
            "total-hours": job.total_hours,
            create_at: job.created_at
        }))

        //return data // caso não estiver usando BD, é só retornar está linha, data é o nome do array que está em comentário
    },
    async update(updatedJob, jobId) {
        // iniciar o BD
        const db = await Database()

        await db.run(`UPDATE jobs SET
        name = "${updatedJob.name}",
        daily_hours = ${updatedJob["daily-hours"]},
        total_hours = ${updatedJob["total-hours"]}
        WHERE id = ${jobId}
        `)

        // fechar a conexão do BD
        await db.close()
    //data = newJob // caso não estiver usando BD, é só retornar está linha, data é o nome do array que está em comentário
    },
    async delete(id) {
        // iniciar o BD
        const db = await Database()

        // ${}: serve para colocar variaveis do js dentro do sql
        await db.run(`DELETE FROM jobs WHERE id = ${id}`)

        // fechar a conexão do BD
        await db.close()

        // filter: parece com o forEach, map e find, só que qdo ele acha algo que está sendo procurando, ele filtra "retira"
        //  se o id for diferente, ele joga o objeto para dentro do array data, qdo ele achar o id igual ao que está sendo procurado, o filter retira aquele objeto e não joga para dentro do array. Fazendo a exclusão daquele objeto
        // tudo que for verdadeiro ele vai deixar no filter, tudo que for falso ele retira "excluindo"
    //data = data.filter(job => Number(job.id) !== Number(id)) // caso não estiver usando BD, é só retornar está linha, data é o nome do array que está em comentário
    },
    async create(newJob) {
        // iniciar o BD
        const db = await Database()

        // newJob: toas informações que está vindo do projeto, para inserir no BD
        // ${}: serve para colocar variaveis do js dentro do sql
        // name = "${newJob.name}": tem que colocar entre "", pq esse campo é string
        db.run(`INSERT INTO jobs(
            name,
            daily_hours,
            total_hours,
            created_at
         ) VALUES(
            "${newJob.name}", 
            ${newJob["daily-hours"]},
            ${newJob["total-hours"]},
            ${newJob.create_at}
        )`)

        // fechar a conexão do BD
        await db.close()

        // mandar novos dados "objetos" para o array data
    //data.push(newJob) // caso não estiver usando BD, é só retornar está linha, data é o nome do array que está em comentário
    }
}