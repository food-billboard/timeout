import { EventEmitter }  from 'eventemitter3'
import { get } from 'lodash'
import mockLogin from './mockLogin'
import { getUserInfo, setUserInfo } from './constants'
import { getUserInfo as fetchUserInfo } from '../services/base'

export const Emitter = new EventEmitter()

// Emitter.addListener('route-change', (history: any) => {
//   const currentUser = get(history, 'location.state.user')
//   const prevUser = getUserInfo().__user__
//   if(currentUser !== prevUser && currentUser) {
//     setUserInfo({
//       __user__: currentUser
//     })
//     mockLogin(currentUser)
//       .then(fetchUserInfo)
//       .then((value) => {
//         setUserInfo(value);
//       });
//   }
// })