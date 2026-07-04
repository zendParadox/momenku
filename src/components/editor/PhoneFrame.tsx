'use client'

interface PhoneFrameProps {
  children: React.ReactNode
  className?: string
  showStatusBar?: boolean
}

export default function PhoneFrame({
  children,
  className = '',
  showStatusBar = true,
}: PhoneFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Phone outer body */}
      <div
        className="relative mx-auto"
        style={{
          width: 390,
          maxWidth: '100%',
        }}
      >
        {/* Shadow / glow behind phone */}
        <div
          className="absolute -inset-4 rounded-[3rem] opacity-30 blur-2xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Phone body */}
        <div
          className="relative bg-[#1a1a1a] rounded-[3rem] p-[10px] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]"
          style={{
            backgroundImage:
              'linear-gradient(145deg, rgba(60,60,60,0.4) 0%, rgba(20,20,20,0.8) 50%, rgba(40,40,40,0.3) 100%)',
          }}
        >
          {/* Side buttons — left */}
          <div className="absolute -left-[2px] top-[100px] w-[3px] h-7 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[2px] top-[140px] w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[2px] top-[168px] w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />

          {/* Side buttons — right */}
          <div className="absolute -right-[2px] top-[130px] w-[3px] h-14 bg-[#2a2a2a] rounded-r-sm" />

          {/* Screen */}
          <div className="relative bg-white rounded-[2.25rem] overflow-hidden">
            {/* Status bar */}
            {showStatusBar && (
              <div className="relative z-10 flex items-center justify-between px-7 pt-3 pb-1 bg-transparent">
                <span className="text-[13px] font-semibold text-black tabular-nums">
                  9:41
                </span>
                <div className="flex items-center gap-1.5">
                  {/* Signal bars */}
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                    <rect x="0" y="8" width="3" height="4" rx="0.5" fill="black" />
                    <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="black" />
                    <rect x="9" y="2" width="3" height="10" rx="0.5" fill="black" />
                    <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="black" />
                  </svg>
                  {/* WiFi */}
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path
                      d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"
                      fill="black"
                    />
                    <path
                      d="M4.93 7.57a4.35 4.35 0 016.14 0"
                      stroke="black"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2.4 5.04a7.5 7.5 0 0111.2 0"
                      stroke="black"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 2.5a10.65 10.65 0 0116 0"
                      stroke="black"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Battery */}
                  <svg width="28" height="13" viewBox="0 0 28 13" fill="none">
                    <rect
                      x="0.5"
                      y="0.5"
                      width="23"
                      height="12"
                      rx="2.5"
                      stroke="black"
                      strokeOpacity="0.35"
                    />
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="9"
                      rx="1.5"
                      fill="black"
                    />
                    <path
                      d="M25 4.5v4a2 2 0 000-4z"
                      fill="black"
                      fillOpacity="0.4"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-black rounded-full w-[126px] h-[36px] shadow-inner" />
            </div>

            {/* Scrollable content */}
            <div className="max-h-[760px] overflow-y-auto overscroll-none">
              {children}
            </div>

            {/* Home indicator */}
            <div className="sticky bottom-0 z-10 flex justify-center pb-2 pt-1 bg-white/80 backdrop-blur-sm">
              <div className="w-[134px] h-[5px] bg-black rounded-full opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
