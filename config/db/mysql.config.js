module.exports = {
    HOST: "101.201.127.11",
    USER: "root",
    PASSWORD: "webmall306",
    DB: "webmall-vue",
    PORT: 8090,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
