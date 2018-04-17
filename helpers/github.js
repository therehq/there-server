import fetch from 'node-fetch'
import Lru from 'lru-cache'
import ms from 'ms'

const cache = Lru({
  max: 10,
  maxAge: ms('12h'),
})

const { GH_TOKEN_RELEASES } = process.env
const latestReleaseAssetsKey = 'github-latest-release'

export const getLatestReleaseDlLink = async () => {
  const cachedAssets = cache.get(latestReleaseAssetsKey)

  let assets
  if (!cachedAssets) {
    // We should fetch for the first time
    console.log('requested....')
    const response = await fetch(
      'https://api.github.com/repos/therepm/there-desktop/releases/latest',
      { headers: { Authorization: `token ${GH_TOKEN_RELEASES}` } },
    )
    ;({ assets } = await response.json())
    cache.set(latestReleaseAssetsKey, assets)
  } else {
    // The assets have been cached
    console.log('used cache...')
    assets = cachedAssets
  }

  // Check if there is no assets, return an error
  if (!assets) {
    throw new Error(`Sorry, couldn't find the file now.`)
  }

  const asset = assets.find(asset => asset.name.endsWith('-mac.zip'))
  return asset.browser_download_url
}
