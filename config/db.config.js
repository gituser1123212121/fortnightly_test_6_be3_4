module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "12345678", // update the db password here
  DB: "chat", //add database name here
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
