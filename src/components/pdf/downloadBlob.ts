/** Déclenche un téléchargement navigateur pour un `Blob` déjà généré (ex. PDF react-pdf) — pas de dépendance externe (`file-saver`) nécessaire pour ce besoin. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
