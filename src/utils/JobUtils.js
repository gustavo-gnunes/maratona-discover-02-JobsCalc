module.exports = {
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
    // é uma função, só que está em uma unica linha
    calculateBudget: (job, valueHour) => valueHour * job["total-hours"] // qtos vai ser cobrado para fazer o projeto
}