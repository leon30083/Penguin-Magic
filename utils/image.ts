/**
 * 图片URL处理工具函数
 * 用于统一处理各种格式的图片URL
 */

/**
 * 统一处理 imageUrl，兼容多种格式：
 * 1. 文件路径格式: /files/output/xxx.jpg
 * 2. 纯 base64 数据格式: /9j/4AAQ... (需要添加 data:image 前缀)
 * 3. 完整 data URL 格式: data:image/jpeg;base64,... (直接返回)
 * 4. HTTP/HTTPS URL: 直接返回
 */
export const normalizeImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  
  // 已经是完整的 data URL
  if (url.startsWith('data:')) return url;
  
  // 文件路径（以 / 开头，但不是 base64）
  if (url.startsWith('/') && !url.startsWith('/9j/') && !url.startsWith('/+')) return url;
  
  // HTTP/HTTPS URL
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // 纯 base64 数据，需要添加前缀
  // 检测常见的 base64 图片签名
  if (url.startsWith('/9j/') || url.startsWith('iVBOR')) {
    // JPEG 或 PNG
    const mimeType = url.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
    return `data:${mimeType};base64,${url}`;
  }
  
  // 其他情况，假定是路径
  return url;
};

/**
 * 将 base64 数据转换为 Blob
 */
export const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * 从 data URL 中提取 base64 数据
 */
export const extractBase64FromDataUrl = (dataUrl: string): string => {
  const matches = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
  return matches ? matches[1] : dataUrl;
};

/**
 * 获取图片的 MIME 类型
 */
export const getImageMimeType = (url: string): string => {
  if (url.startsWith('data:image/')) {
    const match = url.match(/^data:image\/(\w+);/);
    return match ? `image/${match[1]}` : 'image/png';
  }
  
  const ext = url.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/png';
  }
};
