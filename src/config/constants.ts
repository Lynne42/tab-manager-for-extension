/**
 * 静态配置常量
 */

// ==================== Space 图标映射 ====================
export const SPACE_ICONS: Record<string, string> = {
  workspace: '🏢',
  work: '💼',
  personal: '👤',
  study: '📚',
  entertainment: '🎮',
  shopping: '🛒',
  social: '💬',
  development: '💻',
  design: '🎨',
  music: '🎵',
  video: '🎬',
  news: '📰',
}

export const DEFAULT_SPACE_ICON = '📁'

// ==================== 颜色类映射 ====================
export const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500' },
  green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-500' },
  yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-500' },
  red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-500' },
  orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500' },
  pink: { bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-500' },
  gray: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-500' },
}

export const DEFAULT_COLOR = 'gray'

// ==================== 辅助函数 ====================

/**
 * 获取 Space 图标
 * @param {string} icon - 图标键名
 * @returns {string} 对应的图标字符串，如果不存在则返回默认图标
 */
export function getSpaceIcon(icon: string): string {
  return SPACE_ICONS[icon] || DEFAULT_SPACE_ICON
}

/**
 * 获取背景颜色类
 * @param {string} color - 颜色键名
 * @returns {string} Tailwind CSS 背景颜色类名
 */
export function getBgColorClass(color: string): string {
  return COLOR_CLASSES[color]?.bg || COLOR_CLASSES[DEFAULT_COLOR].bg
}

/**
 * 获取边框颜色类
 * @param {string} color - 颜色键名
 * @returns {string} Tailwind CSS 边框颜色类名
 */
export function getBorderColorClass(color: string): string {
  return COLOR_CLASSES[color]?.border || COLOR_CLASSES[DEFAULT_COLOR].border
}

/**
 * 获取文本颜色类
 * @param {string} color - 颜色键名
 * @returns {string} Tailwind CSS 文本颜色类名
 */
export function getTextColorClass(color: string): string {
  return COLOR_CLASSES[color]?.text || COLOR_CLASSES[DEFAULT_COLOR].text
}
