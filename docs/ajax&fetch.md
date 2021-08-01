## XHR

使用 XHR 对象首先要调用 open() 方法，接受三个参数，请求类型（'get'、'post'等）、请求 URL、以及表示请求是否异步的布尔值.

要发送定义好的请求，比如要调用 send 方法

```js
// 发送一个同步的GET请求
xhr.open('get', 'https://a.com/isLogin', false);
xhr.send(null);
```

send()方法接受一个参数，是作为请求体发送的数据。如果不需要发动请求体，则必须传 null，这个参数是必须的，调用 send() 之后，请求就会发送发服务器。

这个请求是同步的，所以 JS 代码会等待服务器响应之后再继续执行，收到响应后，XHR 对象的以下属性会被填充上数据

-   responseText：作为响应体返回的文本
-   responseXML: 如果响应的内容类型是”text/xml“或”application/xml“,那就是包含响应数据的 XML DOM 文档
-   status： 响应的 HTTP 状态
-   statusText：响应的 HTTP 状态描述

收到影响后第一步检查 status 的状态以确保响应成功返回，2xx 表示成功，此时 responseText 或 responseXML（如果内容类型正确）属性中会有内容。304 代表资源未改过，是从浏览器缓存中直接哪去的

```js
if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
} else {
}
```

虽然可以发动同步请求，但是大多数情况下都是发的异步请求，XHR 对象有一个 readyState 属性，这个属性有如下可能的值。

-   0：未初始化（Uninitialized）。尚未调用 open()方法
-   1：已打开（Open）已调用 open()方法，尚未调用 send 方法
-   2：已发送（Send）已调用 send 方法，尚未收到响应
-   3：接收中（Receiving)。已经接收到部分响应
-   4：完成（Complete）。已经收到所有响应，可以使用了

readyState 从一个值变成另一个值，都会触发 readystatechange 事件，可以借此机会检查 readyStat 的值。readystatechange 事件在 open 调用之前赋值

## 进度事件

-   loadstart: 在接收到响应的第一个字节时触发
-   progress: 在接收到响应期间反复触发
-   error: 在请求出错时触发
-   abort: 在调用 abort() 终止连接时触发
-   load: 在成功接受完响应式触发
-   loadend: 在通信完成时，且在 error,abort,或 load 之后触发

每次请求都会首先触发 loadstart 事件，之后是一个或多个 progress 事件，接着是 error、abort 或 load 中的一个，最后已 loadend 事件结束。

### load 事件

用于代替 readystatechange 事件，load 事件在响应接收完成后立即触发，这样就不用检查 readyState 属性了。

http code 为 404，500,的会触发 ajax load 事件。只要浏览器接收到服务器的响应，不管其状态如何，都会触发 load 事件。而这意味着你必须要检 查 status 属性。
