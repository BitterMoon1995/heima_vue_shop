import axios from 'axios'

const devUrl = 'http://localhost:2020/'
//生产环境的服务器一定是有着高贵的【域名】以及带着典雅的【s】
const host01Url = 'https://www.freetour.top:721/'
// const host01Url = 'http://localhost:721/'

const iAxios = axios.create({
  // baseURL:devUrl,
  baseURL:host01Url,
  timeout:3*1000
})

iAxios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  config.headers.Account = window.sessionStorage.getItem('username')
  return config
})

export {iAxios,host01Url,devUrl}
