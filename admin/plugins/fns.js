export default (context, inject) => {
  const generateTimestamp = (date, timeString) => {
    try {
      let time = timeString || '12:00 AM'
      if (time === 'ASAP') time = '12:00 AM'
      date = parseDate(date)
      var hours = parseInt(time.match(/^(\d+)/)[1])
      var minutes = parseInt(time.match(/:(\d+)/)[1])
      var AMPM = time.match(/\s(.*)$/)[1]
      if (AMPM == 'PM' && hours < 12) hours = hours + 12
      if (AMPM == 'AM' && hours == 12) hours = hours - 12
      date.setHours(hours, minutes, 0, 0)
      return date.getTime()
    } catch (e) {
      console.error(e)
      return 0
    }
  }
  const isFullscreen = () => {
    return screen.width < screen.height
  }
  const parseDate = (date, format) => {
    format = format || 'yyyy-mm-dd' // default format
    var parts = date.match(/(\d+)/g),
      i = 0,
      fmt = {}
    // extract date-part indexes from the format
    format.replace(/(yyyy|dd|mm)/g, function(part) {
      fmt[part] = i++
    })
    return new Date(parts[fmt['yyyy']], parts[fmt['mm']] - 1, parts[fmt['dd']])
  }

  const getNow = () => {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-') + ' ' + formatAMPM(d)
  }

  inject('generateTimestamp', generateTimestamp)
  inject('isFullscreen', isFullscreen)
  inject('getNow', getNow)
  context.$getNow = getNow
  context.$generateTimestamp = generateTimestamp
  context.$isFullscreen = isFullscreen
}
