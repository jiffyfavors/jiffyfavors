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
	const formatAMPM = (date) => {
		let hours = date.getHours()
		let minutes = Math.ceil(date.getMinutes() / 5) * 5
		if (minutes === 60) {
			hours = hours + 1
			minutes = 0
		}
		const ampm = hours >= 12 ? 'PM' : 'AM'
		hours = hours % 12
		hours = hours || 12 // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes
		const strTime = hours + ':' + minutes + ' ' + ampm
		return strTime
	}
	const timeRange = (start, end, interval) => {
		start = getNow().substring(0, 10) + ' ' + start
		start = new Date(new Date(start).getTime())
		start = formatAMPM(start)
		end = getNow().substring(0, 10) + ' ' + end
		end = new Date(new Date(end).getTime())
		end = formatAMPM(end)
		let _interval = interval * 60000
		let _start = generateTimestamp(getNow().substring(0, 10), start) + _interval
		let _end = generateTimestamp(getNow().substring(0, 10), end) + _interval
		let time = []
		for (let i = _start; i <= _end; i = i + _interval) {
			time.push(formatAMPM(new Date(i)))
		}
		return time
	}
	const getNow = (date = new Date().getTime()) => {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear()
		if (month.length < 2) month = '0' + month
		if (day.length < 2) day = '0' + day
		return [year, month, day].join('/') + ' ' + formatAMPM(d)
	}
	inject('formatAMPM', formatAMPM)
	inject('timeRange', timeRange)
	inject('getNow', getNow)
	inject('generateTimestamp', generateTimestamp)
	context.$formatAMPM = formatAMPM
	context.$timeRange = timeRange
	context.$getNow = getNow
	context.$generateTimestamp = generateTimestamp
}
