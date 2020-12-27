module.exports = {
    HOST: "47.94.235.82",
    USER: "webmall-server",
    PASSWORD: "webmall306",
    DB: "webmall-vue",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
