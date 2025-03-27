import axios from 'axios'

const clientAxios = axios.create({
  baseURL: 'https://api.trupersona.mohuls.com/api',
})

export default clientAxios
