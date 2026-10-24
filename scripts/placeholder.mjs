// Marcador de las fotos de la carta mientras cargan: el color medio de la foto y una miniatura
// de 16 px en WebP (unos 200 bytes) que la web muestra difuminada. Sale de la versión más pequeña ya optimizada.
import sharp from 'sharp';

export async function placeholder(file) {
  const image = sharp(file).removeAlpha();
  const average = await image.clone().resize(1, 1, { fit: 'fill' }).raw().toBuffer();
  const lqip = await image.clone().resize(16).webp({ quality: 40, smartSubsample: true }).toBuffer();
  return { color: `#${average.toString('hex')}`, lqip: lqip.toString('base64') };
}
