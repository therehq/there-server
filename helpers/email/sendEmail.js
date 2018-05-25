import Mailjet from 'node-mailjet'
import fs from 'mz/fs'
import path from 'path'
const debug = require('debug')('send-email')

const mailjet = Mailjet.connect(
  process.env.MAILJET_KEY_PUBLIC,
  process.env.MAILJET_KEY_PRIVATE,
)

const sendEmail = async ({
  to: { email, name },
  subject,
  textPart,
  template,
  variables,
}) => {
  // Get html content of the template
  const templateHtml = await fs.readFile(
    path.join(__dirname, `../../email-templates/${template}.html`),
    'utf8',
  )

  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'support@there.pm',
          Name: 'There',
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        TextPart: textPart,
        HTMLPart: templateHtml,
        TemplateLanguage: true,
        Subject: subject,
        Variables: variables,
      },
    ],
  })

  return request
}

export default sendEmail
