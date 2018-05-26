import sendEmail from './sendEmail'

export const EMAIL_VERIFICATION = '6591781'
export const sendEmailVerification = (
  To,
  { securityCode, callbackUrl, firstName },
) =>
  sendEmail({
    To,
    TemplateId: EMAIL_VERIFICATION,
    TemplateModel: {
      securityCode,
      callbackUrl,
      firstName: firstName || '',
    },
  })
