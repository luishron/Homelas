export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {/* Casa (Home) */}
        <path
          d="M16 3L4 12V28C4 28.5304 4.21071 29.0391 4.58579 29.4142C4.96086 29.7893 5.46957 30 6 30H12V20H20V30H26C26.5304 30 27.0391 29.7893 27.4142 29.4142C27.7893 29.0391 28 28.5304 28 28V12L16 3Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Moneda */}
        <circle
          cx="23"
          cy="9"
          r="5"
          fill="hsl(var(--background))"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text
          x="23"
          y="12"
          fontSize="8"
          fontWeight="700"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="system-ui, sans-serif"
        >
          $
        </text>
      </svg>
      <span className="text-xl font-bold text-foreground">Tallify</span>
    </div>
  );
}
