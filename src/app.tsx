import { Emitter } from './utils/routeListener'
import VConsole from 'vconsole';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入中文语言包
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);
dayjs.locale('zh-cn'); // 设置中文

if(location.href.includes('vconsole')) {
  window.vconsole = true 
  const vConsole = new VConsole();
}


export const onRouteChange = (location: any, action: any) => {
  Emitter.emit('route-change', location)
  // console.log('全局路由变化', location, action); // action 为 PUSH, REPLACE, POP 等
};