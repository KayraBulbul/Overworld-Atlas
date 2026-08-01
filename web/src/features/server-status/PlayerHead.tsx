import { useEffect, useState } from 'react'
import { tw } from '../../styles/tailwindStyles'
import { buildPlayerHeadUrl, playerHeadFallbackUrl } from './serverStatusApi'

type PlayerHeadProps = {
  uuid: string
  size?: 'compact' | 'large'
}

export function PlayerHead({ uuid, size = 'compact' }: PlayerHeadProps) {
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    setUsingFallback(false)
  }, [uuid])

  return (
    <span
      className={tw(
        size === 'large'
          ? 'player-avatar player-avatar-large'
          : 'player-avatar',
      )}
    >
      <img
        className={tw('player-head-image')}
        src={usingFallback ? playerHeadFallbackUrl : buildPlayerHeadUrl(uuid)}
        alt=""
        width={size === 'large' ? 72 : 42}
        height={size === 'large' ? 72 : 42}
        loading="lazy"
        onError={() => {
          if (!usingFallback) {
            setUsingFallback(true)
          }
        }}
      />
    </span>
  )
}
