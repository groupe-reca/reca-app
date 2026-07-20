import logoSombre from '@/assets/logo-sombre.svg'

let cachedLogoDataUri: Promise<string | null> | null = null

/**
 * Rasterise `logo-sombre.svg` en PNG (data URI) au moment de la génération du PDF. Ni
 * `logo.jpg` (JPEG progressif, connu pour planter/corrompre le rendu de `@react-pdf/renderer`)
 * ni un fichier `.svg` brut (son `<Image>` ne sait pas charger un SVG arbitraire) ne sont
 * utilisables directement — et aucun outil de conversion (ImageMagick/cairosvg/sharp) n'est
 * disponible pour produire un PNG à l'avance. La rasterisation se fait donc via `<canvas>`,
 * dans le navigateur, là où la génération du PDF a de toute façon lieu. `null` si elle échoue
 * (SVG malformé, canvas indisponible) — les en-têtes PDF doivent alors se rabattre sur un
 * bandeau texte seul plutôt que de tenter d'afficher une image cassée.
 */
export function getPdfLogoDataUri(): Promise<string | null> {
  if (!cachedLogoDataUri) {
    cachedLogoDataUri = rasterizeSvgToPng(logoSombre).catch(() => null)
  }
  return cachedLogoDataUri
}

function rasterizeSvgToPng(svgUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = 3
      const width = (img.naturalWidth || 400) * scale
      const height = (img.naturalHeight || 160) * scale
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load SVG logo'))
    img.src = svgUrl
  })
}
