import { ArrowLeft, Archive, Trash2, MailCheck, RefreshCw } from 'lucide-react'
import React, { useState, useRef } from 'react'

import { useMediaQuery } from '@/hooks/useMediaQuery'

// Mock email data
const emails = [
  {
    id: 1,
    sender: 'William Smith',
    subject: 'Meeting Tomorrow',
    preview:
      "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share...",
    tags: ['meeting', 'work', 'important'],
    time: 'over 1 year ago',
    body: `Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William`,
    date: 'Oct 22, 2023, 9:00:00 AM',
    replyTo: 'williamsmith@example.com',
  },
  {
    id: 2,
    sender: 'Alice Smith',
    subject: 'Re: Project Update',
    preview:
      "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a...",
    tags: ['work', 'important'],
    time: 'over 1 year ago',
    body: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job.",
    date: 'Oct 20, 2023, 2:00:00 PM',
    replyTo: 'alicesmith@example.com',
  },
  {
    id: 3,
    sender: 'Bob Johnson',
    subject: 'Weekend Plans',
    preview:
      "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor...",
    tags: ['personal'],
    time: 'about 2 years ago',
    body: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun!",
    date: 'Oct 18, 2023, 5:30:00 PM',
    replyTo: 'bobjohnson@example.com',
  },
  {
    id: 4,
    sender: 'Emily Davis',
    subject: 'Re: Question about Budget',
    preview:
      "I have a question about the budget for the upcoming project. It seems like there's a discrepancy in the allocation of resources. I'v...",
    tags: ['work', 'budget'],
    time: 'about 2 years ago',
    body: "I have a question about the budget for the upcoming project. It seems like there's a discrepancy in the allocation of resources. I've attached my notes.",
    date: 'Oct 17, 2023, 11:00:00 AM',
    replyTo: 'emilydavis@example.com',
  },
  {
    id: 5,
    sender: 'Michael Wilson',
    subject: 'Important Announcement',
    preview:
      'I have an important announcement to make during our team meeting. It pertains to a strategic shift in our approach to the...',
    tags: ['work'],
    time: 'about 2 years ago',
    body: 'I have an important announcement to make during our team meeting. It pertains to a strategic shift in our approach to the project.',
    date: 'Oct 16, 2023, 9:00:00 AM',
    replyTo: 'michaelwilson@example.com',
  },
]

const tagColors: Record<string, string> = {
  meeting: 'bg-gray-200 text-gray-800',
  work: 'bg-black text-white',
  important: 'bg-yellow-400 text-black',
  personal: 'bg-blue-200 text-blue-800',
  budget: 'bg-green-200 text-green-800',
}

function MobileInboxPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = emails.find(e => e.id === selectedId)
  const [search, setSearch] = useState('')

  if (selected) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex items-center px-4 py-3 border-b bg-card">
          <button
            className="mr-2 text-lg"
            onClick={() => setSelectedId(null)}
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="font-semibold text-lg">{selected.sender}</div>
        </div>
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="font-bold text-base mb-2">{selected.subject}</div>
          <div className="text-xs text-gray-400 mb-2">{selected.date}</div>
          <div className="whitespace-pre-line text-gray-800 mb-4">
            {selected.body}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Reply-To: {selected.replyTo}
          </div>
          <div className="flex gap-2 mb-4">
            {selected.tags.map(tag => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${tagColors[tag] || 'bg-gray-200 text-gray-800'}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <textarea
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring mb-2"
            rows={2}
            placeholder={`Reply ${selected.sender}...`}
          />
          <button className="bg-black text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-gray-800 w-full">
            Send
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center px-4 py-3 border-b bg-card">
        <div className="font-semibold text-lg flex-1">Inbox</div>
        <button className="p-2">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      <div className="px-4 py-2">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {emails
          .filter(
            email =>
              email.sender.toLowerCase().includes(search.toLowerCase()) ||
              email.subject.toLowerCase().includes(search.toLowerCase())
          )
          .map(email => (
            <div
              key={email.id}
              className="cursor-pointer px-4 py-3 border-b hover:bg-gray-50 flex flex-col gap-1"
              onClick={() => setSelectedId(email.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{email.sender}</span>
                <span className="text-xs text-gray-400">{email.time}</span>
              </div>
              <div className="font-semibold text-sm truncate">
                {email.subject}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {email.preview}
              </div>
              <div className="flex gap-2 mt-1">
                {email.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${tagColors[tag] || 'bg-gray-200 text-gray-800'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

function DesktopInboxPage() {
  const [selectedId, setSelectedId] = useState(emails[0].id)
  const [sidebarWidth, setSidebarWidth] = useState(340)
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = () => {
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  React.useEffect(() => {
    if (!isResizing) return
    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const min = 260
      const max = 800
      let newWidth = e.clientX - containerRect.left
      newWidth = Math.max(min, Math.min(max, newWidth))
      setSidebarWidth(newWidth)
    }
    const handlePointerUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isResizing])

  const selected = emails.find(e => e.id === selectedId)

  return (
    <div ref={containerRef} className="flex h-full w-full bg-muted flex-1">
      <div
        className="flex flex-col border-r bg-white h-full overflow-y-auto"
        style={{ width: sidebarWidth }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold text-xl">Inbox</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Archive className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Trash2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <MailCheck className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="px-4 py-2">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring"
          />
        </div>
        <div className="overflow-y-auto flex-1">
          {emails.map(email => (
            <div
              key={email.id}
              className={`cursor-pointer px-4 py-3 border-b hover:bg-gray-50 flex flex-col gap-1 ${selectedId === email.id ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedId(email.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{email.sender}</span>
                <span className="text-xs text-gray-400">{email.time}</span>
              </div>
              <div className="font-semibold text-sm truncate">
                {email.subject}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {email.preview}
              </div>
              <div className="flex gap-2 mt-1">
                {email.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${tagColors[tag] || 'bg-gray-200 text-gray-800'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        onPointerDown={handlePointerDown}
        className="w-2 cursor-col-resize bg-gray-100 hover:bg-gray-300 transition-colors select-none"
        style={{ zIndex: 10 }}
      />
      <div className="flex-1 flex flex-col bg-white h-full overflow-y-auto">
        <div className="flex items-center justify-between border-b px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
              {selected?.sender
                .split(' ')
                .map(n => n[0])
                .join('')}
            </div>
            <div>
              <div className="font-semibold text-lg">{selected?.sender}</div>
              <div className="text-sm text-gray-500">{selected?.subject}</div>
              <div className="text-xs text-gray-400 mt-1">
                Reply-To: {selected?.replyTo}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400">{selected?.date}</div>
        </div>
        <div className="flex-1 px-8 py-6 whitespace-pre-line text-gray-800">
          {selected?.body}
        </div>
        <div className="border-t px-8 py-4 bg-gray-50">
          <textarea
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring"
            rows={2}
            placeholder={`Reply William Smith...`}
          />
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 text-xs text-gray-500">
              <input type="checkbox" className="accent-gray-500" /> Mute this
              thread
            </label>
            <button className="bg-black text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-gray-800">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InboxPage() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <MobileInboxPage /> : <DesktopInboxPage />
}
