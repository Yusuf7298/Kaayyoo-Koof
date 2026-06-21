'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PageBlock {
  id: number
  page_type: string
  block_type: string
  title?: string
  description?: string
  block_order: number
  is_visible: boolean
}

export function CMSPageBuilder() {
  const [pageType] = useState('home')
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const blockTypes = ['hero', 'services', 'testimonials', 'cta', 'gallery', 'stats']

  const addBlock = (type: string) => {
    const newBlock: PageBlock = {
      id: Date.now(),
      page_type: pageType,
      block_type: type,
      block_order: blocks.length,
      is_visible: true,
    }
    setBlocks([...blocks, newBlock])
    setIsAdding(false)
  }

  const updateBlock = (id: number, updates: Partial<PageBlock>) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)))
  }

  const deleteBlock = (id: number) => {
    setBlocks(blocks.filter((block) => block.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Builder</CardTitle>
          <CardDescription>Customize your landing page with dynamic blocks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Add Block</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {blockTypes.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  onClick={() => addBlock(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {blocks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No blocks yet. Add one to get started.
              </div>
            ) : (
              blocks.map((block) => (
                <Card key={block.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold capitalize">{block.block_type}</h4>
                      <p className="text-sm text-gray-500">Block #{block.id}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBlock(block.id)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        value={block.title || ''}
                        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                        placeholder="Block title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={block.description || ''}
                        onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                        placeholder="Block description"
                        className="w-full px-3 py-2 border border-input rounded-md text-sm"
                      />
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={block.is_visible}
                        onChange={(e) => updateBlock(block.id, { is_visible: e.target.checked })}
                      />
                      <span className="text-sm">Visible</span>
                    </label>
                  </div>
                </Card>
              ))
            )}
          </div>

          <Button className="w-full mt-6">Save Page</Button>
        </CardContent>
      </Card>
    </div>
  )
}
