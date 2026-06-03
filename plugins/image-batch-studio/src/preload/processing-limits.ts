export const maxMergeGap = 2000;
export const maxMergeDimension = 30000;
export const maxMergePixels = 80_000_000;
export const maxMergeSourcePixels = 60_000_000;
export const maxMergePreparedBytes = 350 * 1024 * 1024;

export const maxGifFrames = 200;
export const maxGifDimension = 4096;
export const maxGifPixels = 4_000_000;

export const maxPdfFiles = 200;
export const maxPdfBytes = 500 * 1024 * 1024;

export function estimateRgbaBytes(width: number | undefined, height: number | undefined): number {
  if (!width || !height) return 0;
  return width * height * 4;
}

export function assertSafeGifRequest(frameCount: number, width: number, height: number): void {
  if (frameCount > maxGifFrames) {
    throw new Error(`GIF 帧数不能超过 ${maxGifFrames} 张`);
  }

  if (width > maxGifDimension || height > maxGifDimension || width * height > maxGifPixels) {
    throw new Error(`GIF 尺寸过大，请使用不超过 ${maxGifDimension}px 且总像素更小的画布`);
  }
}

export function assertSafePdfBatch(fileSizes: number[]): void {
  if (fileSizes.length > maxPdfFiles) {
    throw new Error(`PDF 文件数量不能超过 ${maxPdfFiles} 个`);
  }

  const totalBytes = fileSizes.reduce((sum, size) => sum + size, 0);
  if (totalBytes > maxPdfBytes) {
    throw new Error(`PDF 文件过大，请合并小于 ${Math.round(maxPdfBytes / 1024 / 1024)}MB 的文件`);
  }
}
