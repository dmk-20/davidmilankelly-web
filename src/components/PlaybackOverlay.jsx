export default function PlaybackOverlay() {
  return (
    <div id="playback-overlay" aria-hidden="true">
      <div className="playback-backdrop" aria-hidden="true"></div>
      <div className="playback-inner">
        <button type="button" className="playback-close" aria-label="Close">&times;</button>
        <div className="playback-video-wrap">
          <div id="playback-embed"></div>
          <div id="playback-video-overlay-copy" className="playback-video-overlay-copy" aria-hidden="true"></div>
        </div>
        <div id="playback-caption" className="playback-caption"></div>
      </div>
    </div>
  )
}
