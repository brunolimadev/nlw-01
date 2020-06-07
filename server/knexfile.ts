import path from 'path';

// utiliza module.exports porque o knex não suporta ainda o export default
module.exports = {
    client: 'sqlite3',
    connection:{
        filename: path.resolve(__dirname,'src','database','database.sqlite')
    },
    migrations: {
        directory: path.resolve(__dirname,'src','database','migrations')
    },
    seeds: {
        directory: path.resolve(__dirname,'src','database','seeds')
    },
    useNullAsDefault: true,
};