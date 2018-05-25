const firstAdj = [
  'blank',
  'fewer',
  'kind',
  'one',
  'lovely',
  'Popular',
  'Damanded',
  'final',
  'useful',
  'rubbed',
  'plenty',
  'huge',
  'fine',
  'nice',
  'free',
  'friendly',
  'cool',
  'Peaceful',
]

const secondAdj = [
  'blank',
  'calm',
  'safe',
  'private',
  'red',
  'pink',
  'blue',
  'missing',
  'national',
  'perfect',
  'nighty',
  'loose',
  'tight',
  'baggy',
  'huge',
  'flat',
  'fast',
  'mysterious',
]

const names = [
  'boat',
  'birds',
  'bridge',
  'building',
  'cake',
  'cheese',
  'clock',
  'classroom',
  'flower',
  'freedom',
  'war',
  'wealth',
  'wall',
  'wolf',
  'poem',
  'object',
  'ocean',
  'muscle',
  'mirror',
  'nose',
  'nuts',
  'month',
  'police',
  'shadow',
  'stone',
  'stage',
  'corn',
  'feathers',
  'environment',
  'iron',
  'lamp',
  'land',
]

export const generateRandomPhrase = () => {
  const phraseWords = [firstAdj, secondAdj, names].map(collection => {
    const randomIndex = Math.floor(Math.random() * collection.length)

    const [firstChar, ...restOfWord] = collection[randomIndex]

    return firstChar.toUpperCase() + restOfWord.join('')
  })

  return phraseWords.join(' ')
}
