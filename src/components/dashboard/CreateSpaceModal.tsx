/**
 * CreateSpaceModal 组件 - 创建工作空间模态框
 */

interface CreateSpaceModalProps {
  isOpen: boolean
  name: string
  description: string
  icon: string
  color: string
  creating: boolean
  onClose: () => void
  onChangeName: (name: string) => void
  onChangeDescription: (desc: string) => void
  onChangeIcon: (icon: string) => void
  onChangeColor: (color: string) => void
  onCreate: () => void
}

export default function CreateSpaceModal({
  isOpen,
  name,
  description,
  icon,
  color,
  creating,
  onClose,
  onChangeName,
  onChangeDescription,
  onChangeIcon,
  onChangeColor,
  onCreate,
}: CreateSpaceModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Create New Space</h3>

        <div className="space-y-4">
          {/* 名称 */}
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="My Workspace"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => onChangeDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 图标和颜色 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <select
                value={icon}
                onChange={(e) => onChangeIcon(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="workspace">🏢 Workspace</option>
                <option value="work">💼 Work</option>
                <option value="personal">👤 Personal</option>
                <option value="study">📚 Study</option>
                <option value="entertainment">🎮 Entertainment</option>
                <option value="shopping">🛒 Shopping</option>
                <option value="social">💬 Social</option>
                <option value="development">💻 Development</option>
                <option value="design">🎨 Design</option>
                <option value="music">🎵 Music</option>
                <option value="video">🎬 Video</option>
                <option value="news">📰 News</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <select
                value={color}
                onChange={(e) => onChangeColor(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="blue">🔵 Blue</option>
                <option value="purple">🟣 Purple</option>
                <option value="green">🟢 Green</option>
                <option value="yellow">🟡 Yellow</option>
                <option value="red">🔴 Red</option>
                <option value="orange">🟠 Orange</option>
                <option value="pink">🩷 Pink</option>
                <option value="gray">⚪ Gray</option>
              </select>
            </div>
          </div>
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
            onClick={onCreate}
            disabled={creating || !name.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}
