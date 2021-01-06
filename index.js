const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = __dirname + '/views/';

const app = express();
app.use(express.static(path));

const corsOptions = {
  origin: `http://localhost:8085`
};

global.__basedir = __dirname;

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
const Label = mysql.label;

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
app.get("/", (req, res) => {
  //  res.json({ message: "Welcome to the backend of WebMall." });
  res.sendFile(path + "index.html");
});
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
const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
const wss = require("./controllers/ws.controller")

async function initial() {
  // 创建角色
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "admin"
  });

  // 创建用户
  mysql.user.create({
    id: 1,
    username: 'test',
    avatar: 'https://s3.ax1x.com/2021/01/04/sit7zn.jpg', // https://image.aruoxi.com/webmall/avatar/10.jpg
    email: 'test@qq.com',
    password: '$2a$08$mGafV9KFEtL1mwnRUC29eOVKp7mmemiz6VDIZa9bOqyEusRK9hDpa',
  });

  mysql.user.create({
    id: 2,
    username: 'admin',
    avatar: ' https://image.aruoxi.com/webmall/avatar/10.jpg',
    email: 'admin@webmall.com',
    password: '$08$uu.2FvsiR4F16iQoSmCK9ubhuGihOEfxK47XF/i2KKKre7Ec8oRFm',
  });

  // 创建商店
  mysql.shops.create({
    id: 1,
    name: "HJW's SHOP",
    description: "hjw's shop for test"
  });

  // 创建标签
  Label.create({
    label: '推荐',
    color: 'positive',
    bgColor: 'bg-green-1',
    style: 'border: 1px solid #21BA45'
  });

  Label.create({
    label: '缺货',
    color: 'orange',
    bgColor: 'bg-orange-1',
    style: 'border: 1px solid orange'
  });

  // 创建商品
  for (let i = 1; i <= 30; i++) {
    await controller.createGood({
      name: `mate40pro${i}`,
      description: `测试, mate40pro${i}`,
      price: i*100,
      imgUrl: "https://s3.ax1x.com/2020/12/29/rqegSg.png"
    //   https://s3.ax1x.com/2020/12/29/rqe2lQ.png  //轮播图1
    //   https://s3.ax1x.com/2020/12/29/rqeRyj.png  //轮播图2
    // https://s3.ax1x.com/2020/12/29/rqe6fS.png    //logo
    //   https://s3.ax1x.com/2020/12/29/rqegSg.png  //mate40
    }).then(good => {
      // 设置标签
      good.setLabels([Math.random()%2+1]);
    });
  }

  // 创建评论
  for (let i = 1; i <= 30; i++) {
    const tut1 = await controller.createComment(Math.random() % 30 + 1, {
      name: "hjw",
      text: "测试, 这是一条评论",
    });
  }
}
