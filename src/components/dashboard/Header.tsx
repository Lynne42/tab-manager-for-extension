/**
 * Header 组件 - 应用头部
 */

import logoIcon from '@/assets/ico.png'
import ImportExportButtons from './ImportExportButtons'

interface HeaderProps {
  onNewSpace: () => void
  loadSpaces: () => void
}

export default function Header({ onNewSpace, loadSpaces }: HeaderProps) {

  return (
    <>
      <header className="shrink-0 bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="" width={40} height={40}/>
            <h1 className="text-2xl font-bold">Tab Manager</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* <SpaceCreate
              loadSpaces={loadSpaces}
              onSpaceClick={() => {}}  // 空实现，因为 Header 不需要处理点击
            /> */}
            <ImportExportButtons loadSpaces={loadSpaces} />
          </div>
        </div>
      </header>
    </>
  )
}
