// Edge Function — Envoi de courriel réel (Contrats/Factures, bouton "Envoyer par
// courriel" des fiches détail) via Resend. Comme `analyze-satellite-image`, la clé API
// tierce (RESEND_API_KEY) ne doit jamais être exposée côté client — cette fonction est
// le seul endroit qui la lit.
//
// Expéditeur : domaine `signaweb.ca` vérifié dans Resend (décision explicite de
// l'utilisateur, 2026-07-20). Remplace le domaine de test `onboarding@resend.dev`
// utilisé précédemment.

import { z } from 'npm:zod@3'

const FROM_ADDRESS = 'Groupe RECA <info@signaweb.ca>'
const RESEND_API_URL = 'https://api.resend.com/emails'

const requestSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  attachment: z
    .object({
      filename: z.string().min(1),
      contentBase64: z.string().min(1),
    })
    .optional(),
})

// Requis pour tout appel depuis le navigateur (supabase-js envoie un préflight OPTIONS
// avec les headers Authorization/apikey/content-type) — même convention que
// `analyze-satellite-image`.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  let payload: z.infer<typeof requestSchema>
  try {
    const body = await req.json()
    payload = requestSchema.parse(body)
  } catch {
    return jsonResponse({ error: 'Corps de requête invalide (to/subject/html requis).' }, 400)
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) {
    return jsonResponse({ error: 'RESEND_API_KEY non configurée sur le projet Supabase.' }, 500)
  }

  const resendResponse = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      attachments: payload.attachment
        ? [{ filename: payload.attachment.filename, content: payload.attachment.contentBase64 }]
        : undefined,
    }),
  })

  const resendBody = await resendResponse.json().catch(() => null)
  if (!resendResponse.ok) {
    const message = typeof resendBody?.message === 'string' ? resendBody.message : "Échec de l'envoi via Resend."
    return jsonResponse({ error: message }, resendResponse.status)
  }

  return jsonResponse({ id: resendBody?.id ?? null })
})
