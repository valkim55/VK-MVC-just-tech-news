let sequelize;

if(process.env.JAWSDB_URL) {
    const sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        });
}
