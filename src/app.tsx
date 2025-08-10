import { Emitter } from './utils/routeListener'


export const onRouteChange = (location: any, action: any) => {
  Emitter.emit('route-change', location)
  // console.log('全局路由变化', location, action); // action 为 PUSH, REPLACE, POP 等
};