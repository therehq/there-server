import Storage from '@google-cloud/storage'
import shortid from 'shortid'
import path from 'path'
import fs from 'fs'

const gcs = new Storage({
  projectId: 'there-192619',
  keyFilename: path.resolve(__dirname, '../../secrets/There-552ddaf22779.json'),
})

const isProd = process.env.NODE_ENV === 'production'
const bucketName = 'there-192619.appspot.com'
const bucket = gcs.bucket(bucketName)

const getPublicUrl = pathToFile => {
  return encodeURI(`https://storage.googleapis.com/${bucketName}/${pathToFile}`)
}

const uploadToStorage = () => (req, res, next) => {
  if (!req.file) {
    return next()
  }

  const userId = req.userId || ''
  const extension = path.extname(req.file.originalname)
  const fileName = shortid.generate()
  const fileUniqueName = `${fileName}${extension}`
  const pathToFile = path.join('users/', userId, fileUniqueName)
  const file = bucket.file(pathToFile)

  const stream = file.createWriteStream({
    contentType: req.file.mimetype,
    public: true,
  })

  stream.on('error', err => {
    req.file.cloudStorageError = err
    next(err)
  })

  stream.on('finish', () => {
    req.file.cloudStorageObject = pathToFile
    req.file.cloudStoragePublicUrl = getPublicUrl(pathToFile)
    next()
  })

  stream.end(req.file.buffer)
}

export default uploadToStorage
