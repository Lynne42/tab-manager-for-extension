/**
 * SpaceDetail 组件 - 右侧工作空间详情
 */

import { useState, useEffect } from 'react'
import type { Space } from '../../types'
import { getSpaceIcon, getBgColorClass } from '../../config/constants'
import { createGroup, updateGroup } from '../../services'
import { reorderGroups } from '../../services/groupService'
import { createTab, updateTab, moveTab } from '../../services/tabService'
import { getFaviconUrl, getTitleFromUrl } from '../../utils/url'
import GroupList from './GroupList'
import CreateGroupModal from './CreateGroupModal'
import EditGroupModal from './EditGroupModal'
import CreateTabModal from './CreateTabModal'
import MoveTabModal from './MoveTabModal'
import ReorderGroupsModal from './ReorderGroupsModal'
import Button from '@/atoms/Button'
import AddIcon from '@/assets/add.svg?react'
import MoveIcon from '@/assets/move.svg?react'

interface SpaceDetailProps {
  space: Space
  spaces: Space[]
  isDemoSpace: boolean
  onGroupToggle: (spaceId: string, groupId: string) => void
  onDeleteTab: (spaceId: string, groupId: string, tabId: string) => void
  onOpenTab: (tab: any) => void
  onDeleteGroup: (groupId: string) => void
  onRefresh: () => void
}

export default function SpaceDetail({
  space,
  spaces,
  isDemoSpace,
  onGroupToggle,
  onDeleteTab,
  onOpenTab,
  onDeleteGroup,
  onRefresh,
}: SpaceDetailProps) {
  // Group 创建模态框
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [newGroupIcon, setNewGroupIcon] = useState('')
  const [newGroupColor, setNewGroupColor] = useState('blue')
  const [creatingGroup, setCreatingGroup] = useState(false)

  // Group 编辑模态框
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [editingGroupName, setEditingGroupName] = useState('')

  // Group 排序模态框
  const [showReorderModal, setShowReorderModal] = useState(false)

  // Tab 创建模态框
  const [showCreateTabModal, setShowCreateTabModal] = useState(false)
  const [creatingTabGroupId, setCreatingTabGroupId] = useState('')
  const [newTabTitle, setNewTabTitle] = useState('')
  const [newTabUrl, setNewTabUrl] = useState('')
  const [newTabDescription, setNewTabDescription] = useState('')
  const [newTabPinned, setNewTabPinned] = useState(false)
  const [newTabStatus, setNewTabStatus] = useState<'active' | 'loading' | 'idle' | 'pending'>('idle')
  const [editingTab, setEditingTab] = useState<any>(null)
  const [savingTab, setSavingTab] = useState(false)

  // Tab 移动模态框
  const [showMoveTabModal, setShowMoveTabModal] = useState(false)
  const [movingTab, setMovingTab] = useState<any>(null)
  const [isMoving, setIsMoving] = useState(false)

  // 当 URL 变化时自动生成标题（仅在编辑模式下）
  useEffect(() => {
    if (editingTab && newTabUrl && !newTabTitle) {
      setNewTabTitle(getTitleFromUrl(newTabUrl))
    }
  }, [newTabUrl, editingTab, newTabTitle, getTitleFromUrl])

  // 处理创建 Group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert('Please enter a group name')
      return
    }

    setCreatingGroup(true)
    try {
      const params = {
        spaceId: space.id,
        name: newGroupName.trim(),
        description: newGroupDescription.trim() || undefined,
        icon: newGroupIcon || undefined,
        color: newGroupColor as any,
      }

      const newGroup = await createGroup(params)
      if (newGroup) {
        await onRefresh()
        setShowCreateGroupModal(false)
        setNewGroupName('')
        setNewGroupDescription('')
        setNewGroupIcon('')
        setNewGroupColor('blue')
      }
    } catch (error) {
      console.error('Failed to create group:', error)
      alert('Failed to create group')
    } finally {
      setCreatingGroup(false)
    }
  }

  // 处理保存 Group 排序
  const handleSaveReorder = async (groupIds: string[]) => {
    try {
      await reorderGroups(space.id, groupIds)
      await onRefresh()
    } catch (error) {
      console.error('Failed to reorder groups:', error)
      throw error
    }
  }

  // 处理开始编辑 Group
  const handleStartEditGroup = (group: any) => {
    setEditingGroup(group)
    setEditingGroupName(group.name)
    setShowEditGroupModal(true)
  }

  // 处理保存 Group 名称
  const handleSaveGroupName = async () => {
    if (!editingGroup) return
    if (!editingGroupName.trim()) {
      alert('Group name cannot be empty')
      return
    }

    try {
      await updateGroup(space.id, editingGroup.id, {
        name: editingGroupName.trim(),
      })
      await onRefresh()
      setShowEditGroupModal(false)
      setEditingGroup(null)
      setEditingGroupName('')
    } catch (error) {
      console.error('Failed to update group:', error)
      alert('Failed to update group')
    }
  }

  // 处理开始创建 Tab
  const handleStartCreateTab = (groupId: string) => {
    setCreatingTabGroupId(groupId)
    setNewTabTitle('')
    setNewTabUrl('')
    setNewTabDescription('')
    setNewTabPinned(false)
    setNewTabStatus('idle')
    setEditingTab(null)
    setShowCreateTabModal(true)
  }

  // 处理开始编辑 Tab
  const handleStartEditTab = (tab: any) => {
    setEditingTab(tab)
    setNewTabTitle(tab.title)
    setNewTabUrl(tab.url)
    setNewTabDescription(tab.description || '')
    setNewTabPinned(tab.pinned)
    setNewTabStatus(tab.status)
    setShowCreateTabModal(true)
  }

  // 处理保存 Tab
  const handleSaveTab = async () => {
    if (!newTabUrl.trim()) {
      alert('Please enter URL')
      return
    }

    setSavingTab(true)
    try {
      // 自动生成标题和 favicon URL
      const url = newTabUrl.trim()
      const title = newTabTitle.trim() || getTitleFromUrl(url)
      const favIconUrl = getFaviconUrl(url)
      const description = newTabDescription.trim() || undefined

      if (editingTab) {
        // 更新现有 Tab
        await updateTab(space.id, editingTab.groupId, editingTab.id, {
          title,
          url,
          favIconUrl,
          description,
          pinned: newTabPinned,
          status: newTabStatus,
        })
      } else {
        // 创建新 Tab
        await createTab(space.id, creatingTabGroupId, {
          title,
          url,
          favIconUrl,
          description,
          pinned: newTabPinned,
          status: newTabStatus,
        })
      }

      await onRefresh()
      setShowCreateTabModal(false)
      setNewTabTitle('')
      setNewTabUrl('')
      setNewTabDescription('')
      setNewTabPinned(false)
      setNewTabStatus('idle')
      setEditingTab(null)
    } catch (error) {
      console.error('Failed to save tab:', error)
      alert('Failed to save tab')
    } finally {
      setSavingTab(false)
    }
  }

  // 处理开始移动 Tab
  const handleStartMoveTab = (tab: any) => {
    setMovingTab(tab)
    setShowMoveTabModal(true)
  }

  // 处理执行移动 Tab
  const handleMoveTab = async (toSpaceId: string, toGroupId: string) => {
    if (!movingTab) return
    
    setIsMoving(true)
    try {
      await moveTab(space.id, movingTab.groupId, toSpaceId, toGroupId, movingTab.id)
      await onRefresh()
      setShowMoveTabModal(false)
      setMovingTab(null)
    } catch (error) {
      console.error('Failed to move tab:', error)
      alert('Failed to move tab')
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <>
      <div className="p-6">
        {/* Space 标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-12 h-12 rounded-lg ${getBgColorClass(space.color)} flex items-center justify-center text-2xl`}
            >
              {getSpaceIcon(space.icon)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{space.name}</h2>
                {isDemoSpace && (
                  <span className="px-2 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">Demo</span>
                )}
              </div>
              {space.description && (
                <p className="text-gray-400 text-sm">{space.description}</p>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {space.groups.length} groups · {space.groups.reduce((sum, g) => sum + g.tabs.length, 0)} tabs
          </div>
        </div>

        {/* 添加 Group 按钮 */}
        <div className="mb-4 flex gap-2">
          <Button
            icon={<AddIcon />}
            onClick={() => setShowCreateGroupModal(true)}
            className='px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors'
          >
            Add Group
          </Button>
          {space.groups.length > 1 && (
            <Button
              icon={<MoveIcon />}
              onClick={() => setShowReorderModal(true)}
              className='px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600'
            >
              Reorder
            </Button>
          )}
        </div>

        {/* Groups 列表 */}
        <GroupList
          space={space}
          isDemoSpace={isDemoSpace}
          onGroupToggle={onGroupToggle}
          onDeleteTab={onDeleteTab}
          onOpenTab={onOpenTab}
          onEditGroup={handleStartEditGroup}
          onDeleteGroup={onDeleteGroup}
          onCreateTab={handleStartCreateTab}
          onEditTab={handleStartEditTab}
          onMoveTab={handleStartMoveTab}
          onEditTabVisible={() => {}}
        />
      </div>

      {/* 创建 Group 模态框 */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        name={newGroupName}
        description={newGroupDescription}
        icon={newGroupIcon}
        color={newGroupColor}
        creating={creatingGroup}
        onClose={() => setShowCreateGroupModal(false)}
        onChangeName={setNewGroupName}
        onChangeDescription={setNewGroupDescription}
        onChangeIcon={setNewGroupIcon}
        onChangeColor={setNewGroupColor}
        onCreate={handleCreateGroup}
      />

      {/* 编辑 Group 模态框 */}
      <EditGroupModal
        isOpen={showEditGroupModal}
        name={editingGroupName}
        onClose={() => {
          setShowEditGroupModal(false)
          setEditingGroup(null)
          setEditingGroupName('')
        }}
        onChangeName={setEditingGroupName}
        onSave={handleSaveGroupName}
      />

      {/* 排序 Group 模态框 */}
      <ReorderGroupsModal
        isOpen={showReorderModal}
        space={space}
        onClose={() => setShowReorderModal(false)}
        onSave={handleSaveReorder}
      />

      {/* 创建/编辑 Tab 模态框 */}
      <CreateTabModal
        isOpen={showCreateTabModal}
        title={newTabTitle}
        url={newTabUrl}
        description={newTabDescription}
        pinned={newTabPinned}
        status={newTabStatus}
        groupId={creatingTabGroupId}
        editingTabId={editingTab?.id}
        saving={savingTab}
        onClose={() => setShowCreateTabModal(false)}
        onChangeTitle={setNewTabTitle}
        onChangeUrl={setNewTabUrl}
        onChangeDescription={setNewTabDescription}
        onChangePinned={setNewTabPinned}
        onChangeStatus={setNewTabStatus}
        onSave={handleSaveTab}
      />

      {/* 移动 Tab 模态框 */}
      <MoveTabModal
        isOpen={showMoveTabModal}
        tab={movingTab}
        spaces={spaces}
        currentSpaceId={space.id}
        currentGroupId={movingTab?.groupId || ''}
        moving={isMoving}
        onClose={() => {
          setShowMoveTabModal(false)
          setMovingTab(null)
        }}
        onMove={handleMoveTab}
      />
    </>
  )
}
