const dbconfig = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root123',
        database: 'myapp'
    },
	pool: { min: 0, max: 10 }
}

module.exports = dbconfig;