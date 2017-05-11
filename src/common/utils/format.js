export const formatMoney = (value, option = {}) => {
  return parseFloat(value).toLocaleString('en-US', option)
}
