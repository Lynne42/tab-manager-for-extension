
/**
 * 从 URL 中提取域名
 */
export function getDomainFromUrl(url: string): string {
  try {
    // 移除协议部分
    let cleanUrl = url.replace(/^(https?:\/\/)?/, '')

    // 移除路径、查询参数、片段等
    const domainMatch = cleanUrl.match(/^([^\/\?#\s]+)/)
    if (domainMatch) {
      return domainMatch[1]
    }

    return cleanUrl
  } catch (error) {
    console.warn('Failed to extract domain from URL:', url, error)
    return url
  }
}

/**
 * 根据 URL 推导 favicon URL
 */
export function getFaviconUrl(url: string): string {
  try {
    const domain = getDomainFromUrl(url)
    if (!domain) {
      return ''
    }

    // 如果已经有明确的 favicon URL，直接返回
    if (domain.includes('favicon.ico') || domain.includes('.png') || domain.includes('.jpg') || domain.includes('.svg')) {
      return url.startsWith('http') ? url : `https://${domain}`
    }

    // 标准的 favicon 路径
    return url.startsWith('http')
      ? `${new URL(url).origin}/favicon.ico`
      : `https://${domain}/favicon.ico`
  } catch (error) {
    console.warn('Failed to derive favicon URL from:', url, error)
    return ''
  }
}

/**
 * 从 URL 提取网站标题
 */
export function getTitleFromUrl(url: string): string {
  try {
    const domain = getDomainFromUrl(url)
    if (!domain) {
      return url
    }

    // 移除 www. 前缀
    const cleanDomain = domain.replace(/^www\./, '')

    // 移除顶级域名
    const parts = cleanDomain.split('.')
    if (parts.length > 1) {
      parts.pop() // 移除顶级域名
    }

    return parts.join('.').charAt(0).toUpperCase() + parts.join('.').slice(1)
  } catch (error) {
    console.warn('Failed to extract title from URL:', url, error)
    return url
  }
}