import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useTheme } from '../../chat/hook/useTheme'

const Verify = () => {
    const [countdown, setCountdown] = useState(10)
    const navigate = useNavigate()
    const { theme, toggleTheme, mounted } = useTheme()

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    navigate('/login')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [navigate])

    if (!mounted) return null

    return (
        <main className={`
            min-h-screen w-full flex flex-col overflow-hidden transition-colors duration-300
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

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className={`
                    fixed top-6 right-6 z-50 p-3 rounded-lg border
                    transition-all duration-300 active:scale-95
                    ${theme === 'dark'
                        ? 'border-white/20 bg-white/10 hover:bg-white/15 text-white'
                        : 'border-gray-900/20 bg-gray-900/10 hover:bg-gray-900/15 text-gray-950'
                    }
                `}
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 3.536l.707-.707a1 1 0 011.414 0zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd"></path>
                    </svg>
                )}
            </button>

            {/* Content Container */}
            <div className="relative flex flex-1 w-full h-full items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                <div className={`
                    w-full max-w-lg rounded-2xl border backdrop-blur-xl
                    p-8 sm:p-10 transition-all duration-300 animate-slide-in-up text-center
                    ${theme === 'dark'
                        ? 'border-white/10 bg-[#0e0e0e]/95 shadow-2xl shadow-black/40'
                        : 'border-gray-900/10 bg-white/95 shadow-xl shadow-gray-900/10'
                    }
                `}>
                    {/* Logo Badge */}
                    <div className="mb-6">
                        <span className={`
                            inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold
                            tracking-wider border
                            ${theme === 'dark'
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'bg-gray-900/10 border-gray-900/20 text-gray-950'
                            }
                        `}>
                            Perplexity
                        </span>
                    </div>

                    {/* Success Icon */}
                    <div className={`
                        mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full
                        ${theme === 'dark'
                            ? 'bg-green-500/10 border border-green-500/20'
                            : 'bg-green-500/10 border border-green-500/20'
                        }
                    `}>
                        <svg className={`w-8 h-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Heading */}
                    <h1 className={`
                        text-4xl sm:text-5xl font-light mb-3 tracking-tight
                        ${theme === 'dark'
                            ? 'text-white'
                            : 'text-gray-950'
                        }
                    `}>
                        Success!
                    </h1>
                    <p className={`
                        text-sm sm:text-base mb-6 leading-relaxed font-light
                        ${theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }
                    `}>
                        Your account has been created successfully. Check your email to verify and complete your account setup.
                    </p>

                    {/* Countdown */}
                    <div className={`
                        py-6 px-4 rounded-lg border backdrop-blur-sm mb-6
                        ${theme === 'dark'
                            ? 'bg-white/5 border-white/10'
                            : 'bg-gray-900/5 border-gray-900/10'
                        }
                    `}>
                        <p className={`
                            text-sm mb-3
                            ${theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-600'
                            }
                        `}>
                            Redirecting you to login in
                        </p>
                        <div className={`
                            text-3xl sm:text-4xl font-light tracking-tight
                            ${theme === 'dark'
                                ? 'text-white'
                                : 'text-gray-950'
                            }
                        `}>
                            {countdown}s
                        </div>
                    </div>

                    {/* Message */}
                    <p className={`
                        text-xs sm:text-sm
                        ${theme === 'dark'
                            ? 'text-gray-500'
                            : 'text-gray-500'
                        }
                    `}>
                        If you are not redirected automatically, you can manually visit the login page.
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Verify