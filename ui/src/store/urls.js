import settings from '../settings'

export default function getApiUrl(path) {
    return `${settings.api}${path}`
}