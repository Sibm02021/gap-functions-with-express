module.exports = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: String(process.env.DB_PASS),
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT)
    },
    migrations: {
        directory: './migrations',
        tableName: 'db_migrations'
    }
}