const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const KoaStatic = require('koa-static');

// 静态资源目录对于相对入口文件index.js的路径
// 使用  koa-static  使得前后端都在同一个服务下
app.use(KoaStatic(__dirname));

app.use(cors());
// 测试接口异常
const apiError = (ctx) => {
    throw new Error('接口错了');
};
// 测试接口参数错误
const apiParamsError = (ctx) => {
    ctx.response.body = {
        data: null,
        result: -1,
        msg: '参数错误',
    };
};

// 测试接口参数错误
const apiNormal = (ctx) => {
    ctx.response.body = {
        data: '6666',
        result: 1,
        msg: '',
    };
};

app.use(route.get('/normal', apiNormal));
app.use(route.get('/apiError', apiError));
app.use(route.get('/apiParamsError', apiParamsError));
app.listen(3200, () => {
    console.log('启动成功');
});
