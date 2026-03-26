export default function PlaybackOverlay() {
  return (
    <div id="playback-overlay" aria-hidden="true">
      <div className="playback-backdrop" aria-hidden="true"></div>
      <button type="button" className="playback-close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      <button type="button" className="playback-prev" aria-label="Previous">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button type="button" className="playback-next" aria-label="Next">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      <div className="playback-inner">
        <div className="playback-video-wrap">
          <div id="playback-embed"></div>
          <div id="playback-video-overlay-copy" className="playback-video-overlay-copy" aria-hidden="true"></div>
        </div>
        <div id="playback-caption" className="playback-caption"></div>
      </div>
    </div>
  )
}
