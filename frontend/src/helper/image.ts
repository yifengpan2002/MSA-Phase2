const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const OUTPUT_SIZE = 256;

/**
 * Resizes and centre-crops an image to a square data URL.
 * Keeps avatars around 20KB instead of storing a 4MB phone photo.
 */
export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image must be under 5MB.");
  }

  const bitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not process the image.");

  // Scale so the shorter side fills the square, then centre the overflow.
  const scale = Math.max(
    OUTPUT_SIZE / bitmap.width,
    OUTPUT_SIZE / bitmap.height,
  );
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;

  context.drawImage(
    bitmap,
    (OUTPUT_SIZE - width) / 2,
    (OUTPUT_SIZE - height) / 2,
    width,
    height,
  );
  bitmap.close();

  return canvas.toDataURL("image/jpeg", 0.85);
}
