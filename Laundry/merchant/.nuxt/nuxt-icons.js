export default async function (ctx, inject) {
  const icons = {"64x64":"/_nuxt/icons/icon_64.60aa6e.png","120x120":"/_nuxt/icons/icon_120.60aa6e.png","144x144":"/_nuxt/icons/icon_144.60aa6e.png","152x152":"/_nuxt/icons/icon_152.60aa6e.png","192x192":"/_nuxt/icons/icon_192.60aa6e.png","384x384":"/_nuxt/icons/icon_384.60aa6e.png","512x512":"/_nuxt/icons/icon_512.60aa6e.png"}
  const getIcon = size => icons[size + 'x' + size] || ''
  inject('icon', getIcon)
}
