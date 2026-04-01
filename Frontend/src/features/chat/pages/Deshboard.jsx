import { useSelector } from "react-redux"
import { useChat } from "../hook/useChat";
import { useTheme } from "../hook/useTheme";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChatHome from "../components/ChatHome";

const Deshboard = () => {

  const chat = useChat()
  const { theme, toggleTheme, mounted } = useTheme()

  const [chatInput, setChatInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const messagesEndRef = useRef(null)

  const user = useSelector((state) => state.auth.user)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoadingResponse = useSelector((state) => state.chat.isLoadingResponse)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChat()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats[currentChatId]?.messages, isLoadingResponse])

  const handleStartNewChat = (message) => {
    setChatInput(message)
    // Allow a tick for state update, then submit
    setTimeout(() => {
      chat.handleSendMessage({ message, chatId: null })
    }, 0)
    setChatInput('')
  }

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    console.log(currentChatId);
    console.log(trimmedMessage);
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    if (currentChatId === chatId) {
      return
    }
    chat.handleOpenChats(chatId, chats)
    setSidebarOpen(false)
  }

  const createNewChat = () => {
    setSearchQuery('')
    setSidebarOpen(false)
    chat.handleCreateNewChat()
  }

  // Filter chats based on search
  const filteredChats = Object.values(chats).filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).reverse()

  return (
    <main className={`
      h-screen w-full flex flex-col overflow-hidden transition-colors duration-300
      ${theme === 'dark'
        ? 'bg-gradient-to-br from-black via-[#0b0b0b] to-[#131313] text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-950'
      }
    `}>
      {/* Background decorative elements */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div className={`
          absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl
          ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-900/5'}
        `}></div>
        <div className={`
          absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl
          ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-900/5'}
        `}></div>
      </div>

      <div className='relative flex flex-1 h-full overflow-hidden'>
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className={`md:hidden fixed inset-0 backdrop-blur-sm z-30 transition-all ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-900/50'
              }`}
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:relative md:flex flex-col h-screen md:h-full w-64 md:w-72 shrink-0 z-40
          transition-all duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          rounded-r-2xl md:rounded-2xl border
          ${theme === 'dark'
            ? 'border-zinc-700/50 bg-gradient-to-b from-[#0e0e0e]/98 to-[#0a0a0a]/98 md:shadow-2xl md:shadow-black/40'
            : 'border-gray-200/50 bg-gradient-to-b from-white/98 to-gray-50/98 shadow-lg shadow-gray-900/10'
          }
          p-4 sm:p-5 md:p-5 backdrop-blur-xl
          overflow-y-auto
        `}>
          {/* Header Badge */}
          <div className="mb-5 md:mb-6 flex items-center gap-3">
            <div className={`
              w-8 sm:w-10 h-8 sm:h-10 rounded-lg
              flex items-center justify-center border
              ${theme === 'dark'
                ? 'bg-gradient-to-br from-white/20 to-white/5 border-white/10'
                : 'bg-gradient-to-br from-gray-900/20 to-gray-900/5 border-gray-900/20'
              }
            `}>
              <div className={`
                w-4 sm:w-5 h-4 sm:h-5 border-2 rounded-full
                ${theme === 'dark' ? 'border-white/40' : 'border-gray-900/40'}
              `}></div>
            </div>
            <div>
              <span className={`
                text-xs font-semibold tracking-widest uppercase
                ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}
              `}>Your</span>
              <p className={`
                text-xs sm:text-sm font-semibold
                ${theme === 'dark' ? 'text-white' : 'text-gray-950'}
              `}>Conversations</p>
            </div>
          </div>

          {/* Logo */}
          <h1 className={`
            mb-6 sm:mb-8 text-2xl sm:text-3xl font-light tracking-wide
            bg-clip-text text-transparent
            ${theme === 'dark'
              ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400'
              : 'bg-gradient-to-r from-gray-950 via-gray-800 to-gray-700'
            }
          `}>
            Perplexity
          </h1>

          {/* Search Input */}
          <div className={`
            flex items-center gap-2 mb-5 sm:mb-6 px-3 py-2 rounded-lg
            border
            ${theme === 'dark'
              ? 'bg-white/10 border-white/20'
              : 'bg-gray-900/10 border-gray-900/20'
            }
          `}>
            <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
            <input
              type='text'
              placeholder='Search chats...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full bg-transparent outline-none text-xs sm:text-sm font-light
                ${theme === 'dark'
                  ? 'text-white placeholder-gray-500'
                  : 'text-gray-950 placeholder-gray-500'
                }
              `}
            />
          </div>

          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className={`
              w-full mb-4 sm:mb-5 rounded-lg border
              px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium
              transition-all duration-300 active:scale-95 group
              relative overflow-hidden
              ${theme === 'dark'
                ? 'border-white/30 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white hover:border-white/50 hover:shadow-lg hover:shadow-white/20'
                : 'border-gray-900/40 bg-gradient-to-r from-gray-900/20 to-gray-900/10 hover:from-gray-900/30 hover:to-gray-900/20 text-gray-950 hover:border-gray-900/60 hover:shadow-lg hover:shadow-gray-900/10'
              }
            `}
          >
            {/* Gradient overlay on hover */}
            <span className={`
              absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
              ${theme === 'dark'
                ? 'bg-gradient-to-r from-white/10 to-transparent'
                : 'bg-gradient-to-r from-gray-900/10 to-transparent'
              }
            `}></span>

            {/* Content */}
            <span className="relative flex items-center justify-center gap-2">
              <svg className={`w-4 h-4 transition-transform group-hover:scale-110 ${theme === 'dark' ? '' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="group-hover:font-semibold">New Chat</span>
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>

          {/* Chat List */}
          <div className={`space-y-2 flex-1 overflow-y-auto pr-2 ${theme === 'dark'
            ? 'scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700'
            : ''
            }`}>
            {filteredChats.length > 0 ? (
              filteredChats.map((chatItem, index) => (
                <button
                  onClick={() => { openChat(chatItem.id) }}
                  key={index}
                  type='button'
                  className={`
                    w-full cursor-pointer rounded-lg border px-3 sm:px-4 py-2 sm:py-3
                    text-left text-xs sm:text-sm font-light transition-all duration-300
                    active:scale-95 group
                    ${currentChatId === chatItem.id
                      ? theme === 'dark'
                        ? 'bg-white/10 border-white/30'
                        : 'bg-gray-900/20 border-gray-900/30'
                      : theme === 'dark'
                        ? 'border-zinc-700/40 bg-zinc-900/30 hover:bg-zinc-800/60 hover:border-zinc-600 text-zinc-300 hover:text-white'
                        : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <div className='flex items-start gap-2'>
                    <span className={`
                      text-xs mt-0.5
                      ${currentChatId === chatItem.id
                        ? theme === 'dark'
                          ? 'text-white'
                          : 'text-gray-950'
                        : theme === 'dark'
                          ? 'text-zinc-500 group-hover:text-zinc-400'
                          : 'text-gray-500 group-hover:text-gray-700'
                      }
                    `}>•</span>
                    <span className='line-clamp-2 flex-1'>{chatItem.title}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className='text-center py-8'>
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {searchQuery ? 'No chats found' : 'No conversations'}
                </p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>
                  Start a new chat
                </p>
              </div>
            )}
          </div>

          {/* User Info at bottom */}
          {user && (
            <div className={`mt-4 sm:mt-6 pt-4 border-t ${theme === 'dark' ? 'border-zinc-700/30' : 'border-gray-200/30'
              }`}>
              <div className={`
                rounded-lg p-3 border
                ${theme === 'dark'
                  ? 'bg-zinc-900/50 border-zinc-700/30'
                  : 'bg-gray-100/50 border-gray-900/10'
                }
              `}>
                <p className={`
                  text-xs font-light tracking-wider uppercase
                  ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}
                `}>Account</p>
                <p className={`
                  text-xs sm:text-sm font-light mt-1 truncate
                  ${theme === 'dark' ? 'text-white' : 'text-gray-950'}
                `}>{user?.name || user?.email || 'User'}</p>
              </div>

              {/* Theme Toggle */}
              <div className='mt-4 flex items-center gap-2'>
                <button
                  onClick={toggleTheme}
                  className={`
                    flex-1 flex items-center justify-center gap-2 p-2 rounded-lg
                    border transition-all duration-300 text-xs font-light
                    ${theme === 'dark'
                      ? 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                      : 'bg-gray-900/10 border-gray-900/20 text-gray-700 hover:bg-gray-900/20'
                    }
                  `}
                >
                  {theme === 'dark' ? (
                    <>
                      <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                      </svg>
                      Light
                    </>
                  ) : (
                    <>
                      <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
                      </svg>
                      Dark
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main Chat Area */}
        <section className='relative flex flex-1 flex-col overflow-hidden'>

          {/* Mobile Header - Always visible on mobile */}
          <div className={`
            md:hidden flex items-center justify-between px-3 sm:px-4 py-4 sm:py-3
            border-b flex-shrink-0 transition-colors duration-300 bg-gradient-to-r from-transparent via-gray-900/5 to-transparent
            ${theme === 'dark'
              ? 'border-zinc-700/30 via-white/5'
              : 'border-gray-200/30'
            }
          `}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`
                w-8 h-8 mr-3 rounded-lg border
                flex items-center justify-center
                transition-all
                ${theme === 'dark'
                  ? 'border-white/20 bg-white/5 hover:bg-white/10'
                  : 'border-gray-900/20 bg-gray-900/5 hover:bg-gray-900/10'
                }
              `}
            >
              <div className='flex flex-col gap-1'>
                <div className={`
                  w-4 h-0.5
                  ${theme === 'dark' ? 'bg-white/60' : 'bg-gray-950/60'}
                `}></div>
                <div className={`
                  w-4 h-0.5
                  ${theme === 'dark' ? 'bg-white/60' : 'bg-gray-950/60'}
                `}></div>
                <div className={`
                  w-4 h-0.5
                  ${theme === 'dark' ? 'bg-white/60' : 'bg-gray-950/60'}
                `}></div>
              </div>
            </button>

            {/* Mobile Chat Title */}
            {currentChatId && chats[currentChatId] && (
              <div className='flex items-center gap-2 flex-1'>
                <div className={`
                  w-5 h-5 rounded-lg flex items-center justify-center border flex-shrink-0
                  ${theme === 'dark'
                    ? 'bg-gradient-to-br from-white/15 to-white/5 border-white/10'
                    : 'bg-gradient-to-br from-gray-900/15 to-gray-900/5 border-gray-900/10'
                  }
                `}>
                  <div className={`
                    w-2.5 h-2.5 border-2 rounded-full
                    ${theme === 'dark' ? 'border-white/30' : 'border-gray-900/30'}
                  `}></div>
                </div>
                <h2 className={`text-sm font-light truncate ${theme === 'dark' ? 'text-white' : 'text-gray-950'
                  }`}>
                  {chats[currentChatId]?.title || 'New Chat'}
                </h2>
              </div>
            )}

            {/* Online indicator */}
            {currentChatId && chats[currentChatId] && (
              <span className='bg-green-500/60 w-2 h-2 rounded-full animate-pulse flex-shrink-0'></span>
            )}
          </div>

          {/* Desktop Header - Only on desktop when messages exist */}
          {currentChatId && chats[currentChatId]?.messages?.length > 0 && (
            <div className={`
              hidden md:flex items-center justify-between px-3 sm:px-4 md:px-6 py-4 sm:py-3 md:py-4
              border-b flex-shrink-0 transition-colors duration-300
              ${theme === 'dark'
                ? 'border-zinc-700/30 bg-gradient-to-r from-transparent via-white/5 to-transparent'
                : 'border-gray-200/30 bg-gradient-to-r from-transparent via-gray-900/5 to-transparent'
              }
            `}>
              <div className='flex items-center gap-2 md:gap-3 flex-1 md:flex-none'>
                <div className={`
                  w-6 md:w-8 h-6 md:h-8 rounded-lg
                  flex items-center justify-center
                  flex-shrink-0 border
                  ${theme === 'dark'
                    ? 'bg-gradient-to-br from-white/15 to-white/5 border-white/10'
                    : 'bg-gradient-to-br from-gray-900/15 to-gray-900/5 border-gray-900/10'
                  }
                `}>
                  <div className={`
                    w-3 md:w-4 h-3 md:h-4 border-2 rounded-full
                    ${theme === 'dark' ? 'border-white/30' : 'border-gray-900/30'}
                  `}></div>
                </div>
                <div className='min-w-0'>
                  <h2 className={`
                    text-sm md:text-base font-light truncate
                    ${theme === 'dark' ? 'text-white' : 'text-gray-950'}
                  `}>
                    {chats[currentChatId]?.title || 'New Chat'}
                  </h2>
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>AI Assistant</p>
                </div>
              </div>

              <span className='bg-green-500/60 w-2 h-2 rounded-full animate-pulse flex-shrink-0'></span>
            </div>
          )}

          {/* Messages or Home State */}
          {!currentChatId || !chats[currentChatId]?.messages || chats[currentChatId].messages.length === 0 ? (
            <ChatHome onStartChat={handleStartNewChat} />
          ) : (
            <>
              {/* Messages Container */}
              <div className='messages flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 pb-4 md:pb-6'>
                <div className='flex flex-col gap-3 md:gap-4'>
                  {chats[currentChatId]?.messages && chats[currentChatId].messages.length > 0 && (
                    chats[currentChatId].messages.map((message, idx) => (
                      <div
                        key={message.id || idx}
                        className={`flex w-full animate-fade-in gap-2 md:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* AI Avatar */}
                        {message.role !== 'user' && (
                          <div className={`
                          w-5 md:w-6 h-5 md:h-6 rounded-lg
                          flex-shrink-0 flex items-center justify-center border
                          ${theme === 'dark'
                              ? 'bg-gradient-to-br from-white/20 to-white/5 border-white/10'
                              : 'bg-gradient-to-br from-gray-900/20 to-gray-900/5 border-gray-900/10'
                            }
                        `}>
                            <div className={`
                            w-2.5 md:w-3 h-2.5 md:h-3 border-2 rounded-full
                            ${theme === 'dark' ? 'border-white/40' : 'border-gray-900/40'}
                          `}></div>
                          </div>
                        )}

                        <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} max-w-[70%] sm:max-w-[65%]`}>
                          <div
                            className={`
                            rounded-xl px-3 sm:px-4 md:px-5 py-2 md:py-3
                            text-xs sm:text-sm md:text-base leading-relaxed
                            break-words w-full
                            transition-colors duration-300 border
                            ${message.role === 'user'
                                ? theme === 'dark'
                                  ? 'rounded-br-none bg-gradient-to-br from-white/15 to-white/5 text-white border-white/20 shadow-lg shadow-white/10'
                                  : 'rounded-br-none bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-gray-950 border-blue-500/30 shadow-lg shadow-blue-500/5'
                                : theme === 'dark'
                                  ? 'rounded-bl-none border-zinc-700/40 bg-zinc-900/40 text-zinc-100 shadow-lg shadow-black/20'
                                  : 'rounded-bl-none border-gray-200/50 bg-gray-100/50 text-gray-950 shadow-lg shadow-gray-900/5'
                              }
                          `}
                          >
                            {message.role === 'user' ? (
                              <p className='leading-relaxed'>{message.content}</p>
                            ) : (
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => <p className='mb-2 md:mb-3 last:mb-0 leading-relaxed'>{children}</p>,
                                  ul: ({ children }) => <ul className='mb-2 md:mb-3 list-disc pl-4 md:pl-5 space-y-0.5 md:space-y-1'>{children}</ul>,
                                  ol: ({ children }) => <ol className='mb-2 md:mb-3 list-decimal pl-4 md:pl-5 space-y-0.5 md:space-y-1'>{children}</ol>,
                                  li: ({ children }) => <li className={theme === 'dark' ? 'text-zinc-100' : 'text-gray-950'}>{children}</li>,
                                  code: ({ children }) => <code className={`
                                  rounded px-1.5 md:px-2 py-0.5 md:py-1 font-mono text-xs
                                  ${theme === 'dark'
                                      ? 'bg-black/40 text-emerald-300 border-emerald-500/30'
                                      : 'bg-gray-900/40 text-emerald-600 border-emerald-900/30'
                                    } border
                                `}>{children}</code>,
                                  pre: ({ children }) => <pre className={`
                                  mb-2 md:mb-3 overflow-x-auto rounded-lg
                                  p-2 md:p-4 text-xs border
                                  ${theme === 'dark'
                                      ? 'bg-black/60 border-zinc-700/60 text-emerald-300'
                                      : 'bg-gray-900/60 border-gray-700/60 text-emerald-600'
                                    }
                                `}>{children}</pre>,
                                  h1: ({ children }) => <h1 className={`text-base md:text-lg font-light mt-2 md:mt-3 mb-1 md:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{children}</h1>,
                                  h2: ({ children }) => <h2 className={`text-sm md:text-base font-light mt-2 md:mt-3 mb-1 md:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{children}</h2>,
                                  h3: ({ children }) => <h3 className={`text-xs md:text-sm font-light mt-1 md:mt-2 mb-0.5 md:mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{children}</h3>,
                                }}
                                remarkPlugins={[remarkGfm]}
                              >
                                {message.content}
                              </ReactMarkdown>
                            )}
                          </div>
                        </div>

                        {/* User Avatar */}
                        {message.role === 'user' && (
                          <div className={`
                          w-5 md:w-6 h-5 md:h-6 rounded-lg
                          flex-shrink-0 flex items-center justify-center border
                          ${theme === 'dark'
                              ? 'bg-gradient-to-br from-white/30 to-white/10 border-white/20'
                              : 'bg-gradient-to-br from-blue-500/30 to-blue-500/10 border-blue-500/30'
                            }
                        `}>
                            <div className={`
                            w-2 md:w-2.5 h-2 md:h-2.5 rounded-full
                            ${theme === 'dark' ? 'bg-white/60' : 'bg-blue-600/60'}
                          `}></div>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {/* AI Typing Indicator */}
                  {isLoadingResponse && (
                    <div className='flex w-full animate-fade-in gap-2 md:gap-3 justify-start'>
                      <div className={`
                      w-5 md:w-6 h-5 md:h-6 rounded-lg
                      flex-shrink-0 flex items-center justify-center border
                      ${theme === 'dark'
                          ? 'bg-gradient-to-br from-white/20 to-white/5 border-white/10'
                          : 'bg-gradient-to-br from-gray-900/20 to-gray-900/5 border-gray-900/10'
                        }
                    `}>
                        <div className={`
                        w-2.5 md:w-3 h-2.5 md:h-3 border-2 rounded-full
                        ${theme === 'dark' ? 'border-white/40' : 'border-gray-900/40'}
                      `}></div>
                      </div>
                      <div className='flex justify-start'>
                        <div className={`
                        rounded-xl rounded-bl-none border
                        px-3 sm:px-4 md:px-5 py-2 md:py-3
                        ${theme === 'dark'
                            ? 'border-zinc-700/40 bg-zinc-900/40 shadow-lg shadow-black/20'
                            : 'border-gray-200/50 bg-gray-100/50 shadow-lg shadow-gray-900/5'
                          }
                      `}>
                          <div className='flex gap-1 items-center'>
                            <span className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-zinc-400' : 'bg-gray-500'
                              }`} style={{ animationDelay: '0s' }}></span>
                            <span className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-zinc-400' : 'bg-gray-500'
                              }`} style={{ animationDelay: '0.1s' }}></span>
                            <span className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-zinc-400' : 'bg-gray-500'
                              }`} style={{ animationDelay: '0.2s' }}></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmitMessage} className={`
                px-3 sm:px-4 md:px-6 py-3 md:py-5
                border-t flex-shrink-0 transition-colors duration-300
                ${theme === 'dark'
                  ? 'border-zinc-700/30 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent'
                  : 'border-gray-200/30 bg-gradient-to-t from-white/50 to-transparent'
                }
              `}>
                <div className='w-full'>
                  <div className={`
                  flex gap-2 md:gap-3 items-end transition-all duration-300
                  ${isFocused
                      ? theme === 'dark'
                        ? 'bg-white/5 rounded-xl px-3 md:px-4 py-2 md:py-3 border border-white/10'
                        : 'bg-gray-900/10 rounded-xl px-3 md:px-4 py-2 md:py-3 border border-gray-900/20'
                      : 'bg-transparent'
                    }
                `}>
                    <input
                      type='text'
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder='Ask me anything...'
                      className={`
                      w-full bg-transparent outline-none
                      text-sm md:text-base font-light
                      ${theme === 'dark'
                          ? 'text-white placeholder-zinc-600'
                          : 'text-gray-950 placeholder-gray-500'
                        }
                    `}
                    />
                    <button
                      type='submit'
                      disabled={!chatInput.trim()}
                      className={`
                      flex-shrink-0 rounded-lg border
                      cursor-pointer px-3 md:px-5 py-2 md:py-2.5
                      font-light transition-all duration-200 active:scale-95
                      disabled:cursor-not-allowed disabled:opacity-40
                      ${theme === 'dark'
                          ? 'border-white bg-white hover:bg-zinc-50 active:bg-zinc-200 text-black disabled:hover:bg-white'
                          : 'border-gray-950 bg-gray-950 hover:bg-gray-800 active:bg-gray-700 text-white disabled:hover:bg-gray-950'
                        }
                    `}
                    >
                      <span className='text-sm md:text-lg'>→</span>
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default Deshboard
