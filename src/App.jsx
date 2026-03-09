import { useMemo, useRef, useState } from 'react'

const TABS = {
  PASSWORD: 'password',
  QR: 'qr',
  COLOR: 'color',
}

function hexToRgb(hex) {
  const sanitized = hex.replace('#', '')
  if (sanitized.length !== 6) return null
  const bigint = parseInt(sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

function App() {
  const [activeTab, setActiveTab] = useState(TABS.PASSWORD)

  const passwordRef = useRef(null)
  const qrRef = useRef(null)
  const colorRef = useRef(null)

  // Password generator state
  const [length, setLength] = useState(12)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState('')

  // QR generator state
  const [qrText, setQrText] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)

  // Color picker state
  const [color, setColor] = useState('#FF5733')

  const qrUrl = useMemo(() => {
    const text = qrText.trim() === '' ? ' ' : qrText.trim()
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      text,
    )}`
  }, [qrText])

  const rgb = useMemo(() => hexToRgb(color), [color])

  const handleGeneratePassword = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?/|'

    let charset = letters
    if (includeNumbers) charset += numbers
    if (includeSymbols) charset += symbols

    let result = ''
    for (let i = 0; i < length; i += 1) {
      const index = Math.floor(Math.random() * charset.length)
      result += charset[index]
    }
    setPassword(result)
  }

  const handleCopy = async (value) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // ignore
    }
  }

  const presetColors = [
    '#FF5733',
    '#FF8A00',
    '#FFC300',
    '#00C7FF',
    '#007BFF',
    '#9B51E0',
    '#FF3D85',
    '#00D27F',
  ]

  const handleTabClick = (tab) => {
    setActiveTab(tab)

    if (typeof window === 'undefined') return
    // Only auto-scroll on small screens (mobile / small tablets)
    if (window.innerWidth >= 768) return

    let targetRef = null
    if (tab === TABS.PASSWORD) targetRef = passwordRef
    if (tab === TABS.QR) targetRef = qrRef
    if (tab === TABS.COLOR) targetRef = colorRef

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.22),_transparent_55%),linear-gradient(to_br,_#020617,_#020617)] text-white px-4 py-6 md:py-8">
      <div className="w-full max-w-6xl mx-auto animate-fade-up-soft">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-sky-200 mb-3">
            Hamdan&apos;s Mini Web Tools
          </p>
          <h1 className="text-2xl md:text-4xl font-semibold mb-1">Password, QR &amp; Color Picker — All in One</h1>
        </div>

        {/* Main glass panel */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-700 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl px-4 pt-4 pb-6 md:px-8 md:pt-6 md:pb-8">
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-full bg-slate-800/80 p-1 border border-slate-600 shadow-inner shadow-black/40 transition-transform duration-300 hover:scale-[1.02]">
              <button
                type="button"
                onClick={() => handleTabClick(TABS.PASSWORD)}
                className={`px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-full transition-colors duration-300 ${
                  activeTab === TABS.PASSWORD
                    ? 'bg-white text-sky-700 shadow-md'
                    : 'text-slate-100 hover:text-white'
                }`}
              >
                Password Generator
              </button>
              <button
                type="button"
                onClick={() => handleTabClick(TABS.QR)}
                className={`px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-full transition-colors duration-300 ${
                  activeTab === TABS.QR
                    ? 'bg-white text-fuchsia-700 shadow-md'
                    : 'text-slate-100 hover:text-white'
                }`}
              >
                QR Generator
              </button>
              <button
                type="button"
                onClick={() => handleTabClick(TABS.COLOR)}
                className={`px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-full transition-colors duration-300 ${
                  activeTab === TABS.COLOR
                    ? 'bg-white text-pink-700 shadow-md'
                    : 'text-slate-100 hover:text-white'
                }`}
              >
                Color Picker
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Password Generator Card */}
            <div
              ref={passwordRef}
              className={`min-w-0 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-4 md:p-6 shadow-lg shadow-black/40 transition-transform duration-500 ${
                activeTab === TABS.PASSWORD ? 'scale-[1.02]' : 'opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm md:text-base font-semibold">Password Generator</h2>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/15 border border-white/20">
                  Secure &amp; random
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="uppercase tracking-[0.18em] text-sky-100/80">Password Length</span>
                    <span className="font-semibold text-sky-100">{length}</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="32"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-sky-300"
                  />
                </div>

                <div className="space-y-2 text-xs md:text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="h-4 w-4 rounded border-sky-300/70 bg-sky-900/40 text-sky-300 focus:ring-sky-200"
                    />
                    <span>Include Numbers</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="h-4 w-4 rounded border-sky-300/70 bg-sky-900/40 text-sky-300 focus:ring-sky-200"
                    />
                    <span>Include Symbols</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-lime-400 px-4 py-2 text-xs md:text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 hover:from-emerald-300 hover:to-lime-300 hover:-translate-y-0.5 transition-transform duration-300"
                  >
                    Generate Password
                  </button>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-slate-900/50 border border-sky-500/40 px-3 py-2">
                  <div className="flex-1 truncate text-xs md:text-sm font-mono">
                    {password || 'Click generate to create a password'}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(password)}
                    className="text-[11px] md:text-xs px-3 py-1 rounded-full bg-sky-500 hover:bg-sky-400 font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Generator Card */}
            <div
              ref={qrRef}
              className={`min-w-0 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-4 md:p-6 shadow-lg shadow-black/40 transition-transform duration-500 ${
                activeTab === TABS.QR ? 'scale-[1.02]' : 'opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm md:text-base font-semibold">QR Code Generator</h2>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/15 border border-white/20">
                  Links &amp; text
                </span>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => {
                    setQrText(e.target.value)
                    setQrGenerated(false)
                  }}
                  placeholder="Enter text or URL"
                  className="w-full rounded-xl bg-white/15 border border-white/25 px-3 py-2 text-xs md:text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                />

                <button
                  type="button"
                  onClick={() => setQrGenerated(true)}
                  className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-300 px-4 py-2 text-xs md:text-sm font-semibold text-slate-900 shadow-lg shadow-pink-500/40 hover:from-pink-300 hover:to-orange-200 hover:-translate-y-0.5 transition-transform duration-300"
                >
                  Generate QR Code
                </button>

                <div className="flex justify-center">
                  {qrGenerated ? (
                    <div className="rounded-2xl bg-white p-3 shadow-inner animate-glow-pulse">
                      <img
                        src={qrUrl}
                        alt="Generated QR code"
                        className="h-40 w-40 md:h-48 md:w-48 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-40 md:h-48 flex items-center justify-center text-xs text-white/70">
                      Your QR code will appear here
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <a
                    href={qrGenerated ? qrUrl : '#'}
                    download={qrGenerated ? 'qr-code.png' : undefined}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] md:text-xs font-medium border ${
                      qrGenerated
                        ? 'bg-white/15 border-white/60 hover:bg-white/25'
                        : 'bg-white/5 border-white/25 cursor-not-allowed opacity-60'
                    }`}
                  >
                    Download QR
                  </a>
                </div>
              </div>
            </div>

            {/* Color Picker Card */}
            <div
              ref={colorRef}
              className={`min-w-0 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-4 md:p-6 shadow-lg shadow-black/40 transition-transform duration-500 ${
                activeTab === TABS.COLOR ? 'scale-[1.02]' : 'opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm md:text-base font-semibold">Color Picker</h2>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/20 border border-white/30">
                  Palette &amp; hex
                </span>
              </div>

              <div className="space-y-4">
                {/* Color palette strip */}
                <div className="h-6 md:h-7 w-full rounded-full overflow-hidden bg-gradient-to-r from-red-400 via-yellow-300 via-green-300 via-blue-400 via-purple-500 to-pink-500 mb-1" />

                <div className="flex flex-wrap gap-2 mb-1">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-7 w-7 rounded-xl border-2 transition ${
                        color.toLowerCase() === c.toLowerCase()
                          ? 'border-white shadow-md scale-110'
                          : 'border-white/40 hover:border-white/80'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl border border-white/20 overflow-hidden">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-full w-full cursor-pointer border-0 p-0 bg-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 rounded-xl bg-white/40 border border-white/60 px-3 py-1.5 text-xs md:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>

                <div className="rounded-2xl bg-white/25 border border-white/60 px-3 py-2 flex items-center justify-between">
                  <div className="text-[11px] md:text-xs text-slate-900">
                    <div className="font-semibold mb-0.5">{color.toUpperCase()}</div>
                    <div className="opacity-80">
                      RGB:{' '}
                      {rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '—'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(color)}
                    className="text-[11px] md:text-xs px-3 py-1 rounded-full bg-sky-600 text-white hover:bg-sky-500 font-medium"
                  >
                    Copy Color
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-[10px] md:text-xs text-center text-slate-100/80">
            © 2024 Hamdan&apos;s Mini Tools. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
