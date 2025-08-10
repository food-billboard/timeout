export const AWARD_CYCLE_ENUM = {
  NONE: '无限制',
  WEEK: '周',
  DAY: '天',
  MONTH: '月',
  YEAR: '年',
  QUARTER: '季度'
}

let USER_INFO: {
  username: string 
  score: number 
  avatar: string
  __user__: string 
} = {
  username: '',
  avatar: '',
  score: 0,
  __user__: ''
}

export function getUserInfo() {
  return USER_INFO
}

export function setUserInfo(value: any) {
  USER_INFO = {
    ...USER_INFO,
    ...value
  }
}