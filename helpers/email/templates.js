import sendEmail from './sendEmail'

export const sendEmailVerification = ({ to, securityCode, callbackUrl }) =>
  sendEmail({
    to: { email: to },
    subject: `There Login Verification (code: "${securityCode}")`,
    textPart: `Verify your email to log on to There`,
    template: 'email-verification',
    variables: {
      securityCode,
      callbackUrl,
    },
  })
