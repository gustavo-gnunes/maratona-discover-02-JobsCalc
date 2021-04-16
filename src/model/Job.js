let data = [
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
];

module.exports = {
    get() {
        return data
    },
    update(newJob) {
        data = newJob
    },
    delete(id) {
        // filter: parece com o forEach, map e find, só que qdo ele acha algo que está sendo procurando, ele filtra "retira"
        //  se o id for diferente, ele joga o objeto para dentro do array data, qdo ele achar o id igual ao que está sendo procurado, o filter retira aquele objeto e não joga para dentro do array. Fazendo a exclusão daquele objeto
        // tudo que for verdadeiro ele vai deixar no filter, tudo que for falso ele retira "excluindo"
        data = data.filter(job => Number(job.id) !== Number(id)) 
    }
}