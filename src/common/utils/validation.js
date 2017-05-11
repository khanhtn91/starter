export const required = (value, field) => {
  if (value === undefined || value === null || value === '') {
    return `Please enter ${field}`
  }
  return false
}
