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
  
  const getNow = (days = 0 ) => {
    var x = new Date();
    var d = new Date(x.setDate(x.getDate() - days))
    var  month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-') + ' ' + formatAMPM(d)
  }
  const phCities = () => {
    return [
  "Alaminos City",
  "Angeles City",
  "Antipolo City",
  "Bacolod City",
  "Bacoor City",
  "Bago City",
  "Baguio City",
  "Bais City",
  "Balanga City",
  "Batac City",
  "Batangas City",
  "Bayawan City",
  "Baybay City",
  "Bayugan City",
  "Binan City",
  "Bislig City",
  "Bogo City",
  "Borongan City",
  "Butuan City",
  "Cabadbaran City",
  "Cabanatuan City",
  "Cabuyao City",
  "Cadiz City",
  "Cagayan de Oro City",
  "Calamba City",
  "Calapan City",
  "Calbayog City",
  "Caloocan City",
  "Candon City",
  "Canlaon City",
  "Carcar City",
  "Catbalogan City",
  "Cauayan City",
  "Cavite City",
  "Cebu City",
  "Cotabato City",
  "Dagupan City",
  "Danao City",
  "Dapitan City",
  "Dasmarinas City",
  "Davao City",
  "Digos City",
  "Dipolog City",
  "Dumaguete City",
  "El Salvador City",
  "Escalante City",
  "Gapan City",
  "General Santos City",
  "Gingoog City",
  "Guihulngan City",
  "Himamaylan City",
  "Ilagan City",
  "Iligan City",
  "Iloilo City",
  "Imus City",
  "Iriga City",
  "Isabela City",
  "Kabankalan City",
  "Kidapawan City",
  "Koronadal City",
  "La Carlota City",
  "Lamitan City",
  "Laoag City",
  "Lapu-Lapu City",
  "Las Pinas City",
  "Legazpi City",
  "Ligao City",
  "Lipa City",
  "Lucena City",
  "Maasin City",
  "Mabalacat City",
  "Makati City",
  "Malabon City",
  "Malaybalay City",
  "Malolos City",
  "Mandaluyong City",
  "Mandaue City",
  "Manila City",
  "Marawi City",
  "Marikina City",
  "Masbate City",
  "Mati City",
  "Meycauayan City",
  "Munoz City",
  "Muntinlupa City",
  "Naga City",
  "Naga City",
  "Navotas City",
  "Olongapo City",
  "Ormoc City",
  "Oroquieta City",
  "Ozamiz City",
  "Pagadian City",
  "Palayan City",
  "Panabo City",
  "Paranaque City",
  "Pasay City",
  "Pasig City",
  "Passi City",
  "Puerto Princesa City",
  "Quezon City",
  "Roxas City",
  "Sagay City",
  "Samal City",
  "San Carlos City, Negros Occidental",
  "San Carlos City, Pangasinan",
  "San Fernando City, La Union",
  "San Fernando City, Pampanga",
  "San Jose City",
  "San Jose del Monte City",
  "San Juan City",
  "San Pablo City",
  "Santa Rosa City",
  "Santiago City",
  "Silay City",
  "Sipalay City",
  "Sorsogon City",
  "Surigao City",
  "Tabaco City",
  "Tabuk City",
  "Tacloban City",
  "Tacurong City",
  "Tagaytay City",
  "Tagbilaran City",
  "Taguig City",
  "Tagum City",
  "Talisay City, Negros Occidental",
  "Talisay City, Cebu",
  "Tanauan City",
  "Tandag City",
  "Tangub City",
  "Tanjay City",
  "Tarlac City",
  "Tayabas City",
  "Trece Martires City",
  "Tuguegarao City",
  "Urdaneta City",
  "Valencia City",
  "Valenzuela City",
  "Victorias City",
  "Vigan City",
  "Zamboanga City"
]
  }

  inject('generateTimestamp', generateTimestamp)
  inject('isFullscreen', isFullscreen)
  inject('getNow', getNow)
  inject('phCities', phCities)
  context.$getNow = getNow
  context.$phCities = phCities
  context.$generateTimestamp = generateTimestamp
  context.$isFullscreen = isFullscreen
}
