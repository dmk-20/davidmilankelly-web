export default function PhotoLightbox() {
  return (
    <div id="photo-lightbox" aria-hidden="true">
      <div className="photo-lightbox-backdrop" aria-hidden="true"></div>
      <button type="button" className="photo-lightbox-close" aria-label="Close">&times;</button>
      <button type="button" className="photo-lightbox-prev" aria-label="Previous"><span className="arrow-icon" aria-hidden="true"></span></button>
      <button type="button" className="photo-lightbox-next" aria-label="Next"><span className="arrow-icon" aria-hidden="true"></span></button>
      <img id="photo-lightbox-img" src="" alt="" />
    </div>
  )
}
