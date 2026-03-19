export default function VideoGridItem({ className, href, videoType, videoId, caption, children }) {
  return (
    <a className={`grid-item ${className}`} href={href} data-video-type={videoType} data-video-id={videoId}>
      <div className="grid-image">
        <div className="grid-image-inner-wrapper">
          {children}
        </div>
        {caption && <span className="film-item-caption">{caption}</span>}
      </div>
    </a>
  )
}
