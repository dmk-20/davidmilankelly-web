export default function PhotoItem({ className = '', photoSrc, src, alt = '', loading = 'lazy', decoding = 'async', poster }) {
  return (
    <div className={`photo-item${className ? ' ' + className : ''}`} data-photo-src={photoSrc}>
      <div className="grid-image">
        <div className="grid-image-inner-wrapper">
          {poster && <div className="grid-blur-poster" style={{ backgroundImage: `url(${poster})` }} />}
          <img src={src} alt={alt} loading={loading} decoding={decoding} />
        </div>
      </div>
    </div>
  )
}
