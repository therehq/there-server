import fetch from 'node-fetch'

export const getLatestReleaseDlLink = async () => {
  const response = await fetch(
    'https://api.github.com/repos/therepm/there-desktop/releases/latest',
  )
  const data = await response.json()

  if (!data.assets) {
    throw `Sorry, couldn't find the file now.`
  }

  const asset = data.assets.find(asset => asset.name.endsWith('-mac.zip'))
  return asset.browser_download_url
}
