// responsável por criar o arquivo do banco de dados, criar as tabelas do banco. É rodado uma única vez

const Database = require('./config') // importar o arquivo config.js

const initDb = {
    // async / await: comando do javascript. O await só funciona se ele estiver dentro do async 
    // async: tudo que estiver dentro dele vai ter que esperar. Ele fala para o js que dentro da função vão ter await
    async init() { 
        // await: espera algo ser executado para depois executar outra
        // await: espera o Database terminar de inicializar, para depois executar Database.exec
        // iniciar a conexão com o bd
        const db = await Database()

        // criar tabela no bd
        // await: deve colocar para esperar executar o comando
        await db.exec(`CREATE TABLE profile(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            avatar TEXT,
            monthly_budget INT,
            days_per_week INT,
            hours_per_day INT,
            vacation_per_year INT,
            value_hour INT
        )`)

        await db.exec(`CREATE TABLE jobs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            daily_hours INT,
            total_hours INT,
            created_at DATETIME
        )`)

        // pegar o comando e rodar no bd
        await db.run(`INSERT INTO profile(
            name,
            avatar,
            monthly_budget,
            days_per_week,
            hours_per_day,
            vacation_per_year,
            value_hour
        ) VALUES(
            "Gustavo",
            "https://github.com/gustavo-gnunes.png",
            300,
            5,
            5,
            4,
            70
        )`)

        await db.run(`INSERT INTO jobs(
            name,
            daily_hours,
            total_hours,
            created_at
        ) VALUES(
            "Pizzaria Gulosos",
            2,
            1,
            1617514376018
        )`)

        await db.run(`INSERT INTO jobs(
            name,
            daily_hours,
            total_hours,
            created_at
        ) VALUES(
            "OneTwo Projects",
            3,
            47,
            1617514376018
        )`)

        // fechando a conexão com o bd
        await db.close()
    }
}

initDb.init()