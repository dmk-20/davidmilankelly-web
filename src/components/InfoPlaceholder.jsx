export default function InfoPlaceholder() {
  return (
    <div id="info-placeholder" className="info-placeholder" aria-hidden="true">
      <p>grew up between los angeles and belgrade, serbia.</p>
      <p>director. writer. photographer.</p>
      <p>his recent film beograd was officially selected for competition at the oscar qualifying palm springs international shortfest.</p>
      <h2>selected clients:</h2>
      <p>atlantic records, night media, sony music, nme magazine, paper magazine, dangerbird records, winspear, jenkem magazine, times square nyc, spotify, &amp; more.</p>
      <p className="info-email"><a href="mailto:davidmilankelly@gmail.com">davidmilankelly@gmail.com</a></p>
      <p className="info-instagram">
        <a href="https://instagram.com/davidflipsout" target="_blank" rel="noopener noreferrer" aria-label="Instagram @davidflipsout">
          <svg className="info-instagram-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <span>@davidflipsout</span>
        </a>
      </p>
    </div>
  )
}
