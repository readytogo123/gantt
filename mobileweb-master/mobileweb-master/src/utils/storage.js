// 下面对localstorage进行封装
// 因为刷新页面，token会丢失，所以要先保存在localstorage或者cookie里面
// 上述两者，即使刷新页面数据依然存在

export const setItem = (name, obj) => {
  localStorage.setItem(name, JSON.stringify(obj))
}

export const getItem = name => {
  return JSON.parse(localStorage.getItem(name))
}

export const removeItem = name => {
  localStorage.removeItem(name)
}
