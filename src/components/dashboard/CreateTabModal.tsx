/**
 * CreateTabModal 组件 - 创建标签模态框
 */

interface CreateTabModalProps {
  isOpen: boolean
  title: string
  url: string
  description: string
  pinned: boolean
  status: 'active' | 'loading' | 'idle' | 'pending'
  groupId: string
  editingTabId?: string
  saving: boolean
  onClose: () => void
  onChangeTitle: (title: string) => void
  onChangeUrl: (url: string) => void
  onChangeDescription: (description: string) => void
  onChangePinned: (pinned: boolean) => void
  onChangeStatus: (status: 'active' | 'loading' | 'idle' | 'pending') => void
  onSave: () => void
}

export default function CreateTabModal({
  isOpen,
  title,
  url,
  description,
  pinned,
  status,
  groupId,
  editingTabId,
  saving,
  onClose,
  onChangeTitle,
  onChangeUrl,
  onChangeDescription,
  onChangePinned,
  onChangeStatus,
  onSave,
}: CreateTabModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {editingTabId ? 'Edit Tab' : 'Create New Tab'}
        </h3>

        <div className="space-y-4">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onChangeTitle(e.target.value)}
              placeholder="Tab title"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium mb-1">URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => onChangeUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => onChangeDescription(e.target.value)}
              placeholder="Add a description for this tab..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          
          {/* 分组信息 */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-300">
              <span className="font-medium">Group:</span> {groupId}
            </div>
          </div>

          {/* 状态和固定选项 */}
          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => onChangeStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">🟢 Active</option>
                <option value="loading">⏳ Loading</option>
                <option value="idle">🟡 Idle</option>
                <option value="pending">⏸️ Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pinned</label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => onChangePinned(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">Pin this tab</span>
              </label>
            </div>
          </div> */}
        </div>

        {/* 按钮 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || !title.trim() || !url.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : (editingTabId ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  )
}
