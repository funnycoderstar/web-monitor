## 无埋点方式统计 PV

Page View 这个指标的本原的，统计页面被浏览的次数，而不是被加载的次数
使用 [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) ，Page Visibility API 由 [document.visibilityState](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState) 属性以及 [visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)事件组成

单页应用
使用 [History API]()，这是 SPA 应用构建的基础技术，因此统计工具可以通过监听 URL 变化来发送类似于传统网站的页面统计。

使用 page visibility api 和 history api 来准确统计 page view 的整体思路如下

1. 页面加载时，如果页面的 visibilityState 是可见的，发送 Page View 统计；
2. 如果页面的 visibilityState 是隐藏的，就监听 visibilitychange 事件，并在 visibilityState 变为可见时发送 Page View 统计；
3. 如果 visibilityState 由隐藏变为可见，并且自上次用户交互之后已经过了“足够长”的时间，就发送新的 Page View 统计；
4. 如果 URL 发生变化（仅限于 pathname 或 search 部分发送变化, hash 部分则应该忽略，因为它是用来标记页面内跳转的) 发送新的 Page View 统计；

## UV

统计 UV：每当有新的用户访问应用时，我们会在 cookie 中计入 1 个 UID。该 UID 有效期为 6 个月，有效期内的所有访问记为 1 次 UV。
