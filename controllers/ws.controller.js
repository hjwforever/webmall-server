let userCount = 0; // 统计在线人数
// 记录聊天记录
const chatList = [{"userId":1,"name":"test","avatar":"https://s3.ax1x.com/2021/01/04/sit7zn.jpg","text":["<strong>MebMall聊天室测试</strong>😄"],"time":"2021-01-06T16:00:42.546Z","stamp":"5 minutes ago"},{"userId":2,"name":"admin","avatar":"https://image.aruoxi.com/webmall/avatar/10.jpg","text":["前排围观\n",["hhh😊"]],"time":"2021-01-06T16:01:05.219Z","stamp":"4 minutes ago"},{"userId":1,"name":"test","avatar":"https://s3.ax1x.com/2021/01/04/sit7zn.jpg","text":["👍🤣"],"time":"2021-01-06T16:01:41.484Z","stamp":"4 minutes ago"},{"userId":2,"name":"admin","avatar":"https://image.aruoxi.com/webmall/avatar/10.jpg","text":["<span style=\"color: red\">哇，还可以打HTML语言</span>"],"time":"2021-01-06T16:03:23.148Z","stamp":"2 minutes ago"},{"userId":1,"name":"test","avatar":"https://s3.ax1x.com/2021/01/04/sit7zn.jpg","text":["<span style='color:orange'>是的</span >👏"],"time":"2021-01-06T16:05:08.010Z","stamp":"now"},{"userId":2,"name":"admin","avatar":"https://image.aruoxi.com/webmall/avatar/10.jpg","text":["666"],"time":"2021-01-06T16:07:37.059Z","stamp":"now"}];
const WebSocketServer = require('ws').Server;

let wss = new WebSocketServer({ port: 8181,path: '/ws' });

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

// 调用 broadcast 广播，实现数据互通和实时更新
wss.broadcast = function(msg) {
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
};

wss.on('connection', function(ws, req) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  // console.log(req);

  // 显示用户ip
  // const ip = req.socket.remoteAddress;
  // const ip2 = req.headers['x-forwarded-for'];
  // const ip2 = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
  // console.log(`Connected clients: ${userCount} ip: ${ip} ip2: ${ip2}`);

  userCount++;// 建立连接成功在线人数 +1
  wss.broadcast(JSON.stringify({ funName: 'userCount', userCount: userCount, chat: chatList })); // 建立连接成功广播一次当前在线人数

  // 接收前端发送过来的数据
  ws.on('message', function(e) {
    console.log(e);
    const resData = JSON.parse(e);
    console.log('接收到来自clent的消息：' + resData.text);
    if (chatList.length > 0 && resData.userId === chatList[chatList.length-1].userId) {
      chatList[chatList.length - 1].text.push(resData.text);
    }
    else
      // chatList.push({ userId: resData.userId, name:resData.name, avatar:resData.avatar, text: [resData.text], time: resData.time });// 每次发送信息，都会把信息存起来，然后通过广播传递出去，这样此每次进来的用户就能看到之前的数据
    // wss.broadcast(JSON.stringify({ userId: resData.userId, name:resData.name, avatar:resData.avatar, text: [resData.text], time: resData.time })); // 每次发送都相当于广播一次消息
    chatList.push(resData);// 每次发送信息，都会把信息存起来，然后通过广播传递出去，这样此每次进来的用户就能看到之前的数据
    wss.broadcast(JSON.stringify(resData)); // 每次发送都相当于广播一次消息
  });

  const interval = setInterval(function() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30000);

  ws.on('close', function close() {
    clearInterval(interval);
    userCount--; // 建立连接关闭在线人数 -1
    wss.broadcast(JSON.stringify({ funName: 'userCount', userCount: userCount, chat: chatList }));// 建立连接关闭广播一次当前在线人数
    console.log('Connected clients:', userCount);
    console.log('长连接已关闭');
  });
});
console.log('聊天室服务器创建成功');

module.exports = {
  wss
};
