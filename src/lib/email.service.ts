import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

export type SendEmailInput = {
  to: string
  subject: string
  message: string
  attachment?: {
    filename: string
    blob: Blob
  }
}

/** Lit un `Blob` en base64 pur (sans le préfixe `data:...;base64,` du data URI). */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function toHtml(message: string) {
  const escaped = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<p style="white-space: pre-wrap; font-family: sans-serif;">${escaped}</p>`
}

/**
 * Envoie un courriel réel via l'Edge Function `send-email` (qui appelle Resend côté
 * serveur, la clé API n'est jamais exposée côté client). Lève une erreur sur échec —
 * laissé à l'appelant de la transformer en toast (même convention que
 * `satelliteAnalysis.service.ts`).
 */
export async function sendEmail({ to, subject, message, attachment }: SendEmailInput): Promise<void> {
  const attachmentPayload = attachment
    ? { filename: attachment.filename, contentBase64: await blobToBase64(attachment.blob) }
    : undefined

  const { error } = await supabase.functions.invoke('send-email', {
    body: { to, subject, html: toHtml(message), attachment: attachmentPayload },
  })
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const body = await error.context.json().catch(() => null)
      throw new Error(typeof body?.error === 'string' ? body.error : "Échec de l'envoi du courriel.")
    }
    throw new Error("Échec de l'envoi du courriel.")
  }
}
