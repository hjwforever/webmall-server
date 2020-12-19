const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:8085"
};

global.__basedir = __dirname;
app.use(express.static("views"))


app.use(cors(corsOptions));

//  解析content-type - application/json请求
app.use(bodyParser.json());

// 解析content-type - application/x-www-form-urlencoded的请求
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));

// 连接mysql
const mysql = require("./models");
const controller = require("./controllers/good.controller");
const Role = mysql.role;

// mysql.sequelize.sync()
//   .then(() => {
//     // initial();
//     console.log("Successfully connected to the database!");
//   })
//   .catch(err => {
//     console.log("Cannot connect to the database!", err);
//     process.exit();
//   });

const run = async () => {
  const good1 = await controller.createGood({
    name: "苹果",
    description: "测试, 大苹果, 好吃",
    price: 12
  });
  const tut1 = await controller.createComment(good1.id,{
    name: "hjw",
    text: "测试, 第一条评论",
  });
};
// mysql.sequelize.sync({ force: true }).then(() => {
mysql.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial().then(r => console.log("Initial successfully."));
});

// simple route
// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to the backend of WebMall." });
// });

app.get("/api/", (req, res) => {
  res.json({ message: "Welcome to the backend of WebMall." });
});

// 路由
require("./routes/good.routes")(app);
require("./routes/comment.routes")(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require("./routes/upload.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


async function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "admin"
  });

  mysql.user.create({
    id: 1,
    username: 'test',
    email: 'test@qq.com',
    password: 'test'
  });

  mysql.shops.create({
    id: 1,
    name: "HJW's SHOP",
    description: "hjw's shop for test"
  });

  const good1 = await controller.createGood({
    name: "苹果",
    description: "测试, 大苹果, 好吃",
    price: 13,
    // shopId : 1,
  });

  const tut1 = await controller.createComment(good1.id, {
    name: "hjw",
    text: "测试, 第一条评论",
  });

}
