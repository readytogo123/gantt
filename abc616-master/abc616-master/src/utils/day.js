import dayjs from 'dayjs'

var rTime = require('dayjs/plugin/relativeTime')
dayjs.extend(rTime)

require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')

export const formatTime = (val) => {
  return dayjs(val).format('YYYY-MM-DD')
}

export const relativeTime = (yourTime) => {
  return dayjs().to(dayjs(yourTime))
}
