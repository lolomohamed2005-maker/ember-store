export function Steam({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {[28, 58, 88].map((x, index) => (
        <path
          key={x}
          d={`M${x} 110c-10-14 10-24 0-38s10-24 0-38`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-steam"
          style={{ animationDelay: `${index * 1.1}s` }}
        />
      ))}
    </svg>
  )
}
