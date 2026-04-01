import { useState } from 'react'
import { useTheme } from '../hook/useTheme'

const ChatHome = ({ onStartChat }) => {
  const { theme } = useTheme()
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const suggestions = [
    { icon: '👤', label: 'For you' },
    { icon: '📚', label: 'Study guide' },
    { icon: '💼', label: 'Business' },
    { icon: '❤️', label: 'Health' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onStartChat(input.trim())
      setInput('')
    }
  }

  const handleSuggestionClick = (suggestion) => {
    onStartChat(suggestion)
    setInput('')
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-full px-4 py-8'>
      {/* Animated gradient background elements */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
      </div>

      <div className='relative max-w-2xl w-full space-y-8'>
        {/* Main Title */}
        <div className='text-center space-y-4'>
          <h1 className={`text-6xl md:text-7xl font-light tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-950'
            }`}>
            perplexity
          </h1>
          <p className={`text-xs md:text-sm font-light tracking-wider uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
            AI-powered search and research
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className='w-full'>
          <div className={`
            relative rounded-2xl transition-all duration-300 border backdrop-blur-xl
            ${isFocused
              ? `scale-105 shadow-lg ${theme === 'dark'
                ? 'bg-white/10 shadow-white/10 border-white/20'
                : 'bg-gray-900/10 shadow-gray-900/10 border-gray-900/20'
              }`
              : theme === 'dark'
                ? 'bg-white/5 border-white/10'
                : 'bg-gray-900/5 border-gray-900/10'
            }
          `}>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder='Ask anything...'
              className={`
                w-full px-6 py-4 md:py-5 bg-transparent
                outline-none text-lg font-light
                ${theme === 'dark'
                  ? 'text-white placeholder-gray-400'
                  : 'text-gray-950 placeholder-gray-600'
                }
              `}
            />
            <button
              type='submit'
              disabled={!input.trim()}
              className={`
                absolute right-4 top-1/2 -translate-y-1/2
                p-2 md:p-3 rounded-lg
                transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:scale-110 active:scale-95
                ${theme === 'dark'
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-gray-900/20 hover:bg-gray-900/30 text-gray-950'
                }
              `}
            >
              <svg className='w-5 h-5 md:w-6 md:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 9l3 3m0 0l-3-3m3 3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </button>
          </div>
        </form>

        {/* Suggestion Chips */}
        <div className='flex flex-wrap gap-3 md:gap-4 justify-center pt-4'>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.label)}
              className={`
                px-4 md:px-5 py-2 md:py-3 rounded-full text-sm font-light border
                hover:scale-105 transition-all duration-200
                active:scale-95
                flex items-center gap-2
                ${theme === 'dark'
                  ? 'bg-white/10 border-white/20 text-gray-100 hover:bg-white/20'
                  : 'bg-gray-900/10 border-gray-900/20 text-gray-900 hover:bg-gray-900/20'
                }
              `}
            >
              <span className='text-lg'>{suggestion.icon}</span>
              <span>{suggestion.label}</span>
            </button>
          ))}
        </div>

        {/* Info Text */}
        <div className='text-center pt-4'>
          <p className={`text-xs md:text-sm font-light ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
            Use AI for instant answers and deep research
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatHome
