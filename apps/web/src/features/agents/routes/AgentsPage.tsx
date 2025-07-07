import { Bot, Clock, GitCommitHorizontal } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const AGENT_MODELS = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-4', value: 'gpt-4' },
  { label: 'GPT-3.5', value: 'gpt-3.5' },
]

const mockMessages = [
  {
    id: 1,
    sender: 'AI',
    text: 'Ask me to help draft replies, organize emails, or manage your inbox',
  },
  { id: 2, sender: 'You', text: 'Show me my recent sent emails.' },
  { id: 3, sender: 'AI', text: 'Here are your 5 most recent sent emails...' },
]

const mockHistory = [
  {
    date: 'Yesterday',
    items: [
      {
        id: 1,
        title: 'Generate documentation for public APIs',
        repo: 'xdenniepe/mental-toughness-quiz',
        branch: 'main',
        timeAgo: '1h',
        diff: '+260',
      },
    ],
  },
]

export default function AgentsPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState('')
  const [agentModel, setAgentModel] = useState(AGENT_MODELS[0].value)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { id: Date.now(), sender: 'You', text: input }])
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex w-full h-full bg-background">
      <aside className="w-[340px] bg-muted/40 border-r flex flex-col py-8 px-6 shadow-md flex-shrink-0">
        <div className="flex items-center gap-2 mb-6">
          <GitCommitHorizontal className="w-5 h-5 text-muted-foreground" />
          <span className="uppercase text-xs font-semibold tracking-wider text-muted-foreground">
            Recent Activity
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-6 pr-2">
          {mockHistory.map(history => (
            <div key={history.date}>
              <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider px-1">
                {history.date}
              </div>
              {history.items.map(item => (
                <div
                  key={item.id}
                  className="bg-background rounded-xl shadow-sm border border-border px-6 py-4 flex flex-col gap-2 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-4 h-4" /> {item.timeAgo}
                    </span>
                    <span className="flex-1 text-xs text-muted-foreground truncate">
                      {item.repo} = {item.branch}
                    </span>
                    <span className="text-green-500 font-mono ml-2">
                      {item.diff}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-foreground mt-1 truncate">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 flex flex-col bg-background">
        <div className="w-full flex flex-col h-full">
          <div className="flex items-center gap-2 px-8 py-8 mx-auto w-full">
            <Bot className="text-primary w-5 h-5" />
            <Select value={agentModel} onValueChange={setAgentModel}>
              <SelectTrigger className="w-32 h-9 px-2 text-base font-semibold bg-background rounded-md shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGENT_MODELS.map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 flex flex-col gap-6 px-8 py-4 overflow-y-auto mx-auto w-full">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No messages yet.
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={
                    msg.sender === 'You'
                      ? 'flex justify-end'
                      : 'flex justify-start'
                  }
                >
                  <div
                    className={
                      'rounded-xl px-5 py-3 max-w-[70%] text-base ' +
                      (msg.sender === 'You'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-foreground border border-border')
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
          <form
            className="flex gap-2 px-8 py-6 border-t bg-background shadow-lg mx-auto w-full"
            onSubmit={e => {
              e.preventDefault()
              handleSend()
            }}
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me to draft replies, organize emails, or manage your inbox"
              className="flex-1 bg-background border border-border rounded-full px-4 py-3 text-base shadow-sm"
            />
            <Button
              type="submit"
              className="px-6 rounded-full h-12 text-base font-semibold shadow-sm"
            >
              Send
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
