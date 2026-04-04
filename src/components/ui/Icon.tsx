'use client'

import { useState } from 'react'
import { ICONS } from '@/lib/icons'
import type { IconName } from '@/lib/icons'

interface Props {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 24, className }: Props) {
  const icon = ICONS[name]
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <span
        className={className}
        style={{ fontSize: size * 0.85, lineHeight: 1 }}
        role="img"
        aria-label={icon.alt}
      >
        {icon.emoji}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={icon.src}
      alt={icon.alt}
      width={size}
      height={size}
      className={className}
      onError={() => setImgError(true)}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
