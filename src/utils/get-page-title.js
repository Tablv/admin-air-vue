import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Glaway-air-vue'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
