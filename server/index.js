const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const KoaStatic = require('koa-static');

// 使用  koa-static  使得前后端都在同一个服务下
app.use(KoaStatic(__dirname));

// 初始金额为 1000
let money = 1000;

// 调用登陆的接口
const login = (ctx) => {
    throw new Error('接口错了');
    ctx.response.body = {
        data: {
            money,
        },
        msg: '登陆成功',
    };
};

app.use(cors());
app.use(route.get('/login', login));
app.listen(3200, () => {
    console.log('启动成功');
});
