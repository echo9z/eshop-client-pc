import Mock from 'mockjs'
// import url from 'url'
Mock.setup({
  // 随机延迟 200-600毫秒。 模拟网络延迟
  timeout: '200-600'
})

/**
 * Mock.mock( rurl, rtype, function( options ) )
 * rurl 需要拦截的 URL，可以是 URL 字符串或 URL 正则: /\/domain\/list\.json/、'/domian/list.json'。
 * rtype 需要拦截的 Ajax 请求类型。例如 GET、POST、PUT
 * template 表示数据模板，可以是对象或字符串。例如 { 'data|1-10':[{}] }、'@EMAIL'
 * function(options) 表示用于生成响应数据的函数
 *    options 指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性
 */
// 一般用正则表达式去匹配，地址栏url 拦截 /my/test
Mock.mock(/\/my\/test/, 'get', () => {
  const arr = []
  for (let i = 0; i < 5; i++) {
    const mock = Mock.mock({
      id: '@id',
      name: '自煮火锅不排队 麦饭石不粘鸳鸯火锅',
      desc: '清汤鲜香 红汤劲爽',
      'price|1-100.1-10': 1
    })
    arr.push(mock)
  }
  return { msg: '获取数据成功', result: arr }
})

function queryString (urlStr = '') {
  const url = new URL(urlStr)
  const obj = {}
  url.searchParams.forEach((value, name) => {
    obj[name] = value
  })
  return obj
}
// 模拟我的收藏
Mock.mock(/\/member\/collect/, 'get', (config) => {
  console.log(config)
  const queryObj = queryString(config.url)
  const items = []
  for (let i = 0; i < +queryObj.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)', // 10 -20个中文文字
      desc: '@ctitle(4,20)',
      price: '@float(20,200,2,2)', // 10-200直接，后面保留2位小数
      // 网络图片地址随机的1-8
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return {
    msg: '获取成功',
    result: {
      counts: 35, // 总条数
      pageSize: +queryObj.pageSize, // 一页有多少条数据
      page: +queryObj.page, // 第几页
      items
    }
  }
})
