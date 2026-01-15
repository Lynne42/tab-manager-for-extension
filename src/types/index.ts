/**
 * Tab Manager 数据模型定义
 */

// ==================== 基础类型 ====================

export type TabStatus = 'active' | 'loading' | 'idle' | 'pending'

export type SpaceColor =
  | 'blue'
  | 'purple'
  | 'green'
  | 'yellow'
  | 'red'
  | 'orange'
  | 'pink'
  | 'gray'

export type SpaceIcon =
  | 'workspace'
  | 'work'
  | 'personal'
  | 'study'
  | 'entertainment'
  | 'shopping'
  | 'social'
  | 'development'
  | 'design'
  | 'music'
  | 'video'
  | 'news'
  | 'custom'

// ==================== Tab ====================

/**
 * 浏览器标签数据
 */
export interface Tab {
  /** 唯一标识 (UUID) */
  id: string

  /** 所属分组 ID */
  groupId: string

  /** Chrome 原生 tab ID (可选，用于同步当前打开的标签) */
  chromeTabId?: number

  /** 网址 */
  url: string

  /** 标题 */
  title: string

  /** 网站图标 URL */
  favIconUrl?: string

  /** 描述信息 */
  description?: string

  /** 标签状态 */
  status?: TabStatus

  /** 是否固定 */
  pinned?: boolean

  /** 创建时间 */
  createdAt: number

  /** 更新时间 */
  updatedAt: number
}

// ==================== Group ====================

/**
 * 分组数据 (一个 Space 下的小组)
 */
export interface Group {
  /** 唯一标识 (UUID) */
  id: string

  /** 所属工作空间 ID */
  spaceId: string

  /** 分组名称 */
  name: string

  /** 分组描述 */
  description?: string

  /** 分组图标 */
  icon?: string

  /** 分组颜色 */
  color?: SpaceColor

  /** 标签列表 */
  tabs: Tab[]

  /** 展开状态 */
  expanded: boolean

  /** 排序权重 (越小越靠前) */
  order: number

  /** 创建时间 */
  createdAt: number

  /** 更新时间 */
  updatedAt: number
}

// ==================== Space ====================

/**
 * 工作空间数据 (最高层级分类)
 */
export interface Space {
  /** 唯一标识 (UUID) */
  id: string

  /** 工作空间名称 */
  name: string

  /** 工作空间描述 */
  description?: string

  /** 工作空间图标 */
  icon: SpaceIcon

  /** 工作空间颜色 */
  color: SpaceColor

  /** 分组列表 */
  groups: Group[]

  /** 是否激活 */
  active: boolean

  /** 排序权重 */
  order: number

  /** 创建时间 */
  createdAt: number

  /** 更新时间 */
  updatedAt: number
}

// ==================== Storage ====================

/**
 * Chrome Storage 存储的根数据结构
 */
export interface TabManagerStorage {
  /** 工作空间列表 */
  spaces: Space[]

  /** 当前激活的工作空间 ID */
  activeSpaceId: string | null

  /** 数据版本 (用于迁移) */
  version: number

  /** 最后同步时间 */
  lastSyncAt?: number
}

// ==================== UI State ====================

/**
 * UI 状态 (不持久化到 storage)
 */
export interface UIState {
  /** 当前选中的 Space ID */
  selectedSpaceId: string | null

  /** 当前选中的 Group ID */
  selectedGroupId: string | null

  /** 搜索关键字 */
  searchQuery: string

  /** 是否正在加载 */
  loading: boolean

  /** 错误信息 */
  error: string | null

  /** 侧边栏是否展开 */
  sidebarExpanded: boolean
}

// ==================== 辅助类型 ====================

/**
 * 创建新实体的参数
 */
export type CreateSpaceParams = Pick<Space, 'name' | 'description' | 'icon' | 'color'>
export type CreateGroupParams = Pick<Group, 'spaceId' | 'name' | 'description' | 'icon' | 'color'>
export type CreateTabParams = Omit<Tab, 'id' | 'createdAt' | 'updatedAt'>

/**
 * 更新实体的参数
 */
export type UpdateSpaceParams = Partial<Omit<Space, 'id' | 'createdAt'>>
export type UpdateGroupParams = Partial<Omit<Group, 'id' | 'spaceId' | 'createdAt'>>
export type UpdateTabParams = Partial<Omit<Tab, 'id' | 'groupId' | 'createdAt'>>

/**
 * 默认值
 */
export const DEFAULT_SPACE: Omit<Space, 'id' | 'name' | 'groups' | 'createdAt' | 'updatedAt'> = {
  icon: 'workspace',
  color: 'blue',
  active: false,
  order: 0,
  description: undefined,
}

export const DEFAULT_GROUP: Omit<Group, 'id' | 'spaceId' | 'name' | 'tabs' | 'createdAt' | 'updatedAt'> = {
  expanded: true,
  order: 0,
  description: undefined,
  icon: undefined,
  color: undefined,
}

export const DEFAULT_TAB: Omit<Tab, 'id' | 'groupId' | 'url' | 'title' | 'createdAt' | 'updatedAt'> = {
  status: 'idle',
  pinned: false,
  favIconUrl: undefined,
  chromeTabId: undefined,
  description: undefined,
}

/**
 * Storage 初始值
 */
export const INITIAL_STORAGE: TabManagerStorage = {
  spaces: [],
  activeSpaceId: null,
  version: 1,
  lastSyncAt: undefined,
}
