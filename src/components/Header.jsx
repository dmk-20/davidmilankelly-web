export default function Header() {
  return (
    <header id="header">
      <div className="header-title">
        <a href="#" className="header-name">
          <span
            className="header-name-text"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: '2.25rem',
              fontWeight: 400,
              letterSpacing: '-0.04em',
            }}
          >
            david milan kelly
          </span>
        </a>
      </div>
      <div className="header-nav-wrap">
        <button type="button" className="header-menu-btn" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav className="header-nav">
          <a href="#" data-view="work">Work</a>
          <a href="#film" data-view="film">Film</a>
          <a href="#photo" data-view="photo">Photo</a>
          <a href="#info" data-view="info">Info</a>
        </nav>
      </div>
    </header>
  )
}
