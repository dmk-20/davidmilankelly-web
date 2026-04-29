export default function VideoGridItem({ className, href, videoType, videoId, caption, children }) {
  return (
    <div
      className={`grid-item ${className}`}
      data-video-type={videoType}
      data-video-id={videoId}
      role="button"
      tabIndex={0}
      aria-label={caption || 'Open video'}
    >
      <div className="grid-image">
        <div className="grid-image-inner-wrapper">
          {children}
        </div>
      </div>
      {caption && <span className="film-item-caption">{caption}</span>}
    </div>
  )
}
