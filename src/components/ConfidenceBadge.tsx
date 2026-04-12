interface ConfidenceBadgeProps {
  score: number
}

export function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const percentage = Math.round(score * 100)

  let colorClass: string
  if (percentage >= 70) {
    colorClass = 'bg-green-100 text-green-800'
  } else if (percentage >= 40) {
    colorClass = 'bg-yellow-100 text-yellow-800'
  } else {
    colorClass = 'bg-red-100 text-red-800'
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${colorClass}`}
    >
      {percentage}%
    </span>
  )
}
