/**
 * ImportExportButtons 组件 - 导入导出按钮组
 */

import { useState, useRef } from 'react'
import { exportData, generateExportFilename, importData, parseImportDataForConversion, calculateImportStats, mergeImportedData } from '../../utils/dataManager'
import { getStorage, setStorage } from '../../utils/storage'
import Button from '@/atoms/Button'
import ImportIcon from '@/assets/import.svg?react'
import ImportingIcon from '@/assets/importing.svg?react'
import ExportIcon from '@/assets/export.svg?react'
import ExportingIcon from '@/assets/exporting.svg?react'

interface ImportExportButtonsProps {
  loadSpaces: () => void
}

export default function ImportExportButtons({ loadSpaces }: ImportExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理导出数据
  const handleExportData = async () => {
    try {
      setIsExporting(true)

      const data = await getStorage()
      exportData(data, generateExportFilename())

      setTimeout(() => {
        setIsExporting(false)
      }, 1000)
    } catch (error) {
      alert('Failed to export data: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setIsExporting(false)
    }
  }

  // 处理导入数据
  const handleImportData = async (file: File) => {
    try {
      setIsImporting(true)

      // 获取当前数据
      const currentData = await getStorage()

      // 解析导入文件
      const fileContent = await file.text()
      const parsedImportData = parseImportDataForConversion(fileContent)
      const { spaces: importedSpaces } = await importData(file)

      // 计算导入统计（包括被跳过的项目）
      const stats = calculateImportStats(parsedImportData)

      // 预览合并结果
      const mergedData = mergeImportedData(currentData, importedSpaces)
      const existingSpacesCount = currentData.spaces.length
      const newSpacesCount = mergedData.spaces.length - existingSpacesCount
      const newGroupsCount = importedSpaces.reduce((sum, space) => sum + space.groups.filter(g => g.tabs.length > 0).length, 0)
      const newTabsCount = importedSpaces.reduce((sum, space) =>
        sum + space.groups.reduce((groupSum, group) => groupSum + (group.tabs.length > 0 ? group.tabs.length : 0), 0)
      )

      // 构建导入确认消息
      let message = 'Import Summary:\n\n'
      message += `${stats.totalSpaces} spaces in import file\n\n`
      message += `Will be added:\n`
      message += `• ${newSpacesCount} new spaces\n`
      message += `• ${newGroupsCount} new groups\n`
      message += `• ${newTabsCount} new tabs\n\n`

      if (stats.skippedGroups > 0 || stats.skippedSpaces > 0) {
        message += `Skipped (empty):\n`
        if (stats.skippedGroups > 0) {
          message += `• ${stats.skippedGroups} groups with no tabs\n`
        }
        if (stats.skippedSpaces > 0) {
          message += `• ${stats.skippedSpaces} spaces with no valid groups\n`
        }
        message += '\n'
      }

      message += 'Existing data will be preserved. Continue?'

      // 确认导入
      if (!confirm(message)) {
        setIsImporting(false)
        return
      }

      // 保存合并后的数据
      await setStorage(mergedData)

      // 刷新界面
      loadSpaces()

      // 显示成功消息
      alert(`Data imported successfully!\n\n${newSpacesCount} spaces, ${newGroupsCount} groups, ${newTabsCount} tabs added to your workspace.`)

      setIsImporting(false)
    } catch (error) {
      let errorMessage = 'Failed to import data'
      if (error instanceof Error) {
        errorMessage += ': ' + error.message
      }
      alert(errorMessage)
      setIsImporting(false)
    }
  }

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    await handleImportData(file)
    // 重置文件输入，允许重复选择同一文件
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-3">
      {/* 导出按钮 */}
      <Button
        onClick={handleExportData}
        disabled={isExporting}
        icon={isExporting ? <ExportingIcon /> : <ExportIcon />}
        title={isExporting ? 'Exporting...' : 'Export'}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-700 disabled:cursor-not-allowed rounded-lg text-white transition-colors flex items-center gap-2 text-sm"
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>

      {/* 导入按钮 */}
      <label className="flex items-center gap-2">
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          disabled={isImporting}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          icon={isImporting ? <ImportingIcon /> : <ImportIcon />}
          className=" bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700 disabled:cursor-not-allowed rounded-lg text-white transition-colors text-sm"
        >
          {isImporting ? 'Importing... ' : 'Import'}
        </Button>
      </label>
    </div>
  )
}