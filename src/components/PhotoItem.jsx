import { useRef } from 'react'

export default function PhotoItem({ className = '', photoSrc, src, alt = '', loading = 'lazy', decoding = 'async', poster }) {
  const wrapperRef = useRef(null)

  // Use rAF so the poster is painted visible for at least one frame before fading out,
  // even when the image is already in cache and load fires synchronously.
  function markLoaded() {
    requestAnimationFrame(() => wrapperRef.current?.classList.add('full-loaded'))
  }

  return (
    <div className={`photo-item${className ? ' ' + className : ''}`} data-photo-src={photoSrc}>
      <div className="grid-image">
        <div className="grid-image-inner-wrapper" ref={wrapperRef}>
          {poster && <div className="grid-blur-poster" style={{ backgroundImage: `url(${poster})` }} />}
          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding={decoding}
            onLoad={markLoaded}
            ref={(el) => { if (el?.complete) markLoaded() }}
          />
        </div>
      </div>
    </div>
  )
}
