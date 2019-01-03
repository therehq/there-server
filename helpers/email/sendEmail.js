import postmark from 'postmark'
import fs from 'mz/fs'
import path from 'path'
const debug = require('debug')('send-email')

const client = new postmark.Client(process.env.POSTMARK_SERVER_KEY)

const sendEmail = async ({ To, TemplateId, TemplateModel }) => {
  return new Promise((res, rej) => {
    client.sendEmailWithTemplate(
      {
        From: 'support@there.team',
        To,
        TemplateId,
        TemplateModel,
      },
      async err => {
        if (err) {
          // 406 means the user became inactive, either by having an email
          // hard bounce or they marked as spam
          if (err.code === 406) {
            debug(`Email user is deactive: ${to}`)
          }

          console.error('Error sending email:')
          console.error(err)
          return rej(err)
        }
        res()
        debug(`email to ${To} sent successfully`)
      },
    )
  })
}

export default sendEmail
