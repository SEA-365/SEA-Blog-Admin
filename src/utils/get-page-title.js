import defaultSettings from '@/settings'

const title = defaultSettings.title || 'SEA-Blog Admin'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
