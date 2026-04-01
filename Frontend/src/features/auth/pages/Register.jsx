import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useTheme } from '../../chat/hook/useTheme'

const Register = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const loading = useSelector((state) => state.auth.loading)
    const { theme, toggleTheme, mounted } = useTheme()

    const { handleRegister } = useAuth()

    const submitForm = async (e) => {
        e.preventDefault()

        const payload = {
            username,
            email,
            password,
        }

        await handleRegister(payload)
        navigate("/verify")
    }

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
                    w-full max-w-md rounded-2xl border backdrop-blur-xl
                    p-8 sm:p-10 transition-all duration-300 animate-slide-in-up
                    ${theme === 'dark'
                        ? 'border-white/10 bg-[#0e0e0e]/95 shadow-2xl shadow-black/40'
                        : 'border-gray-900/10 bg-white/95 shadow-xl shadow-gray-900/10'
                    }
                `}>
                    {/* Logo Badge */}
                    <div className="mb-6 text-center">
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

                    {/* Heading */}
                    <h1 className={`
                        text-4xl sm:text-5xl font-light mb-3 tracking-tight
                        ${theme === 'dark'
                            ? 'text-white'
                            : 'text-gray-950'
                        }
                    `}>
                        Create Account
                    </h1>
                    <p className={`
                        text-sm sm:text-base mb-8 leading-relaxed font-light
                        ${theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }
                    `}>
                        Register with your email to get started.
                    </p>

                    <form onSubmit={submitForm} className="space-y-5">
                        <div>
                            <label htmlFor="username" className={`
                                mb-2 block text-sm font-medium transition-colors
                                ${theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                }
                            `}>
                                Full Name
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="John Doe"
                                required
                                className={`
                                    w-full rounded-lg border px-4 py-3 text-sm
                                    transition-all duration-300 outline-none
                                    ${theme === 'dark'
                                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.1)]'
                                        : 'bg-gray-900/5 border-gray-900/20 text-gray-950 placeholder-gray-500 focus:border-gray-900/40 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)]'
                                    }
                                `}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className={`
                                mb-2 block text-sm font-medium transition-colors
                                ${theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                }
                            `}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                required
                                className={`
                                    w-full rounded-lg border px-4 py-3 text-sm
                                    transition-all duration-300 outline-none
                                    ${theme === 'dark'
                                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.1)]'
                                        : 'bg-gray-900/5 border-gray-900/20 text-gray-950 placeholder-gray-500 focus:border-gray-900/40 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)]'
                                    }
                                `}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className={`
                                mb-2 block text-sm font-medium transition-colors
                                ${theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                }
                            `}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="••••••••"
                                required
                                className={`
                                    w-full rounded-lg border px-4 py-3 text-sm
                                    transition-all duration-300 outline-none
                                    ${theme === 'dark'
                                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.1)]'
                                        : 'bg-gray-900/5 border-gray-900/20 text-gray-950 placeholder-gray-500 focus:border-gray-900/40 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)]'
                                    }
                                `}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full rounded-lg font-semibold px-4 py-3 text-sm
                                transition-all duration-300 active:scale-95
                                disabled:opacity-60 disabled:cursor-not-allowed
                                ${theme === 'dark'
                                    ? 'bg-white text-black border border-white/20 hover:bg-gray-100 cursor-pointer'
                                    : 'bg-gray-950 text-white border border-gray-950/20 hover:bg-black cursor-pointer'
                                }
                            `}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <p className={`
                        mt-8 text-center text-sm
                        ${theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }
                    `}>
                        Already have an account?{' '}
                        <Link to="/login" className={`
                            font-semibold transition-colors
                            ${theme === 'dark'
                                ? 'text-white hover:text-gray-200'
                                : 'text-gray-950 hover:text-gray-700'
                            }
                        `}>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Register