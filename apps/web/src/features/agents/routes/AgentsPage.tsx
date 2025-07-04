import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const mockMessages = [
  { id: 1, sender: 'AI', text: 'Ask Cursor to build, fix bugs, explore' },
]

export default function AgentsPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { id: Date.now(), sender: 'You', text: input }])
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-2xl flex flex-col">
          <div className="mb-8 text-2xl font-semibold tracking-tight">
            Agents
          </div>
          <div className="w-full bg-card rounded-xl shadow p-8 flex flex-col items-center">
            <div className="w-full flex flex-col gap-4 min-h-[120px] max-h-80 overflow-y-auto mb-6">
              {messages.map(msg => (
                <div key={msg.id} className="flex items-start gap-2">
                  <div className="rounded bg-muted px-3 py-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground mr-2">
                      {msg.sender}:
                    </span>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Cursor to build, fix bugs, explore"
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm"
              />
              <Button onClick={handleSend} className="px-4">
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
