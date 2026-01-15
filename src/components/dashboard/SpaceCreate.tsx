import { useState } from 'react';
import CreateSpaceModal from './CreateSpaceModal'
import type { CreateSpaceParams } from '../../types'
import { createSpace } from '@/services'
import AddIcon from '@/assets/add.svg?react'
import Button from '@/atoms/Button';

export default function SpaceCreate({
    loadSpaces,
    onSpaceClick,
}: {
    loadSpaces: () => void;
    onSpaceClick: (spaceId: string) => void;
}) {

    // Space 创建模态框
    const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false)
    const [newSpaceName, setNewSpaceName] = useState('')
    const [newSpaceDescription, setNewSpaceDescription] = useState('')
    const [newSpaceIcon, setNewSpaceIcon] = useState('workspace')
    const [newSpaceColor, setNewSpaceColor] = useState('blue')
    const [creatingSpace, setCreatingSpace] = useState(false)

    const onNewSpace = () => {
        setShowCreateSpaceModal(true)
    }
    // 处理创建 Space
    const handleCreateSpace = async () => {
        if (!newSpaceName.trim()) {
            alert('Please enter a space name')
            return
        }

        setCreatingSpace(true)
        try {
            const params: CreateSpaceParams = {
                name: newSpaceName.trim(),
                description: newSpaceDescription.trim() || undefined,
                icon: newSpaceIcon as any,
                color: newSpaceColor as any,
            }

            const newSpace = await createSpace(params)
            if (newSpace) {
                await loadSpaces()
                onSpaceClick(newSpace.id)
                setShowCreateSpaceModal(false)
                setNewSpaceName('')
                setNewSpaceDescription('')
                setNewSpaceIcon('workspace')
                setNewSpaceColor('blue')
            }
        } catch (error) {
            console.error('Failed to create space:', error)
            alert('Failed to create space')
        } finally {
            setCreatingSpace(false)
        }
    }
    return (
        <>
            <Button 
                icon={<AddIcon />} 
                onClick={onNewSpace} 
                title="New Space"
                className='p-2 bg-blue-600 hover:bg-blue-700 transition-colors'/>
            
            {/* 创建 Space 模态框 */}
            <CreateSpaceModal
                isOpen={showCreateSpaceModal}
                name={newSpaceName}
                description={newSpaceDescription}
                icon={newSpaceIcon}
                color={newSpaceColor}
                creating={creatingSpace}
                onClose={() => setShowCreateSpaceModal(false)}
                onChangeName={setNewSpaceName}
                onChangeDescription={setNewSpaceDescription}
                onChangeIcon={setNewSpaceIcon}
                onChangeColor={setNewSpaceColor}
                onCreate={handleCreateSpace}
            />
        </>
    )
}