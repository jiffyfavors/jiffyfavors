// importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js')
// importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js')
// importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-functions.js')
// const firebaseConfig = {
//   apiKey: 'AIzaSyDX-atoLm6nQpMgQ_GYHIo1kiscAe5txXc',
//   authDomain: 'sound-aileron-279710.firebaseapp.com',
//   databaseURL: 'https://sound-aileron-279710.firebaseio.com',
//   projectId: 'sound-aileron-279710',
//   storageBucket: 'sound-aileron-279710.appspot.com',
//   messagingSenderId: '953894101400',
//   appId: '1:953894101400:web:c06b9af64f518a17f14bed',
//   measurementId: 'G-RLCD9YBDHX'
// }
// firebase.initializeApp(firebaseConfig)

importScripts('/__/firebase/7.15.0/firebase-app.js')
importScripts('/__/firebase/7.15.0/firebase-messaging.js')
importScripts('/__/firebase/init.js')

const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(function(payload) {
  return self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    image: payload.notification.image,
    data: payload.notification.data,
    vibrate: [100, 50, 100],
    icon: '/icon-96px.png',
    badge: '/badge.png'
  })
})

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification
  var data = e.notification.data 
  if (data.hasOwnProperty('open_link') && data.open_link != '') {
    clients.openWindow(data.open_link)
  } else {
    clients.openWindow('https://m.jiffyfavors.com')
  }
  notification.close()
})
