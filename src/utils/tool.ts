
import qs from 'querystring'
import { history } from 'umi';
import dayjs from 'dayjs'

export const hasDays = (day: dayjs.Dayjs | string) => {
  return dayjs().diff(dayjs(day), 'day') + 1
}

// 处理query 传参的时候导致的空字符串查询问题（后端不愿意给处理）
export const formatQuery = (query: any ={})=>{
  const ret: any = {}
  Object.keys(query).forEach((key) => {
    if( query[key] !== null && query[key] !== undefined && query[key]!=='' ){
      ret[key] = query[key]
    }
  })
  return ret;
}

export function getQuery() {
  const { search } = new URL(location.href)
  return qs.parse(search.replace('?', ''))
}

export function jump(path: string, method: 'push' | 'replace') {

}
