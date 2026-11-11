import nodemailer from 'nodemailer'

const TEXTS = {
  fr: {
    subject: (code) => `Ton code de connexion : ${code}`,
    intro: 'Pour te connecter, ouvre ce lien sur l’appareil où tu veux apprendre :',
    code: 'Ou saisis ce code dans l’application :',
    expiry: 'Le lien et le code expirent dans 15 minutes. Si tu n’as rien demandé, ignore cet e-mail.',
    button: 'Me connecter',
  },
  en: {
    subject: (code) => `Your sign-in code: ${code}`,
    intro: 'To sign in, open this link on the device you want to learn on:',
    code: 'Or enter this code in the app:',
    expiry: 'The link and the code expire in 15 minutes. If you did not ask for this, ignore this email.',
    button: 'Sign in',
  },
}

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

function loginMessage({ to, link, code, lang }) {
  const t = TEXTS[lang] || TEXTS.fr
  return {
    to,
    subject: t.subject(code),
    text: `${t.intro}\n${link}\n\n${t.code} ${code}\n\n${t.expiry}\n`,
    html: `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;color:#141415">
<p>${t.intro}</p>
<p><a href="${escape(link)}" style="display:inline-block;padding:12px 20px;border-radius:12px;background:#dc2626;color:#fff;text-decoration:none;font-weight:600">${t.button}</a></p>
<p>${t.code}</p>
<p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p>
<p style="color:#66666b;font-size:14px">${t.expiry}</p>
</div>`,
  }
}

/**
 * Envoi des e-mails de connexion. smtpUrl : smtps://identifiant:mot-de-passe@hote:465 (Brevo, Gmail, …).
 * Sans smtpUrl (developpement uniquement) : le lien et le code sont ecrits dans le journal.
 */
export function createMailer({ smtpUrl, from, log }) {
  if (!smtpUrl) {
    return {
      async sendLogin(message) {
        log.warn({ to: message.to, link: message.link, code: message.code }, 'e-mail de connexion non envoye (SMTP_URL absent)')
      },
    }
  }
  const transport = nodemailer.createTransport(smtpUrl)
  return {
    async sendLogin(message) {
      await transport.sendMail({ from, ...loginMessage(message) })
    },
  }
}
