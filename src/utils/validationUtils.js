import moment from 'moment'

export default {
  cpf: (number) => {
    let rest
    let sum
    sum = 0
    if (number === '00000000000') return false

    for (let i = 1; i <= 9; i++) sum = sum + parseInt(number.substring(i - 1, i)) * (11 - i)
    rest = (sum * 10) % 11

    if ((rest === 10) || (rest === 11)) rest = 0
    if (rest !== parseInt(number.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(number.substring(i - 1, i)) * (12 - i)
    rest = (sum * 10) % 11

    if ((rest === 10) || (rest === 11)) rest = 0
    if (rest !== parseInt(number.substring(10, 11))) return false
    return true
  },

  date: (value, format = 'YYYY-MM-DD') => {
    return moment(value, format, true).isValid()
  },

  money: (value) => {
    if (typeof value === 'string') return false
    return value.toString().match(/^\d*(.\d{0,2})?$/)
  }
}
