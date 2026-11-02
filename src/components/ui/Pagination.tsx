interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  if (pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="border border-line px-3 py-2 text-sm disabled:opacity-30"
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-9 w-9 text-sm ${
            p === page ? 'bg-ink text-cream' : 'border border-line text-ink hover:border-forest'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        className="border border-line px-3 py-2 text-sm disabled:opacity-30"
      >
        Next
      </button>
    </nav>
  )
}
