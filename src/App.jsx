import { useEffect, useRef } from 'react'
import PhotoLightbox from './components/PhotoLightbox.jsx'
import Header from './components/Header.jsx'
import InfoPlaceholder from './components/InfoPlaceholder.jsx'
import PlaybackOverlay from './components/PlaybackOverlay.jsx'
import VideoGridItem from './components/VideoGridItem'
import PhotoItem from './components/PhotoItem'

export default function App() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // ===== SIMPLE VIEW MANAGER =====
    const viewLabels = { work: 'FEATURED WORK', film: 'Film', photo: 'Photography' }
    const labelEl = document.getElementById('page-section-label')
    const infoEl = document.getElementById('info-placeholder')
    const nav = document.querySelector('.header-nav')

    function getView() {
      const hash = window.location.hash.slice(1).toLowerCase()
      return ['film', 'photo', 'info'].includes(hash) ? hash : 'work'
    }

    function setView(view) {
      document.body.style.opacity = '0.8'
      setTimeout(() => {
        document.body.className = `view-${view}`
        document.body.style.opacity = '1'
      }, 50)

      nav.querySelectorAll('a').forEach(a => {
        if (a.dataset.view === view) {
          a.setAttribute('aria-current', 'page')
        } else {
          a.removeAttribute('aria-current')
        }
      })

      if (labelEl) {
        labelEl.style.opacity = '0'
        labelEl.style.transform = 'translateY(-10px)'
        setTimeout(() => {
          labelEl.textContent = viewLabels[view] || ''
          labelEl.setAttribute('aria-hidden', view === 'info' ? 'true' : 'false')
          labelEl.style.opacity = '1'
          labelEl.style.transform = 'translateY(0)'
        }, 100)
      }

      if (infoEl) {
        infoEl.setAttribute('aria-hidden', view !== 'info' ? 'true' : 'false')
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ===== VIDEO PLAYBACK =====
    window.openVideoPlayback = function(link) {
      const type = link.getAttribute('data-video-type')
      const id = link.getAttribute('data-video-id')
      if (!type || !id) return false

      const overlay = document.getElementById('playback-overlay')
      const embed = document.getElementById('playback-embed')
      const captionEl = document.getElementById('playback-caption')
      const overlayCopy = document.getElementById('playback-video-overlay-copy')

      if (!overlay || !embed) return false

      const src = type === 'youtube'
        ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
        : type === 'vimeo'
          ? `https://player.vimeo.com/video/${id}?autoplay=1`
          : ''

      if (!src) return false

      const isBeograd = id === 'pR-9xte4bgg' || link.classList.contains('film-beograd')

      if (isBeograd && type === 'youtube') {
        embed.innerHTML = `
          <div class="playback-beograd-thumb">
            <img src="/images/beograd-16x9-cover.jpg" alt="">
            <button type="button" class="playback-beograd-play" aria-label="Play"></button>
          </div>
        `

        const thumbWrap = embed.querySelector('.playback-beograd-thumb')
        const playBtn = embed.querySelector('.playback-beograd-play')

        function startBeogradVideo() {
          embed.innerHTML = `<iframe src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:none;"></iframe>`
        }

        if (playBtn) playBtn.addEventListener('click', (e) => { e.stopPropagation(); startBeogradVideo() })
        if (thumbWrap) thumbWrap.addEventListener('click', (e) => { if (e.target === thumbWrap || e.target.tagName === 'IMG') startBeogradVideo() })
      } else {
        embed.innerHTML = `<iframe src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:none;"></iframe>`
      }

      const projectName = link.getAttribute('title') ||
        (link.querySelector('.film-item-caption') && link.querySelector('.film-item-caption').textContent) || ''

      if (captionEl) {
        captionEl.innerHTML = projectName ? `<span class="playback-caption-project">${projectName}</span>` : ''
      }

      if (overlayCopy) {
        overlayCopy.innerHTML = ''
      }

      overlay.classList.add('open', 'playback-overlay--work')
      if (isBeograd) overlay.classList.add('playback-overlay--beograd')
      overlay.setAttribute('aria-hidden', 'false')

      return false
    }

    // ===== PHOTO LIGHTBOX =====
    const photoItems = Array.from(document.querySelectorAll('.photo-item[data-photo-src]'))

    function openPhoto(src) {
      const lightbox = document.getElementById('photo-lightbox')
      const img = document.getElementById('photo-lightbox-img')

      img.classList.remove('photo-lightbox-img-visible')
      img.src = src

      if (img.complete) {
        img.classList.add('photo-lightbox-img-visible')
      } else {
        img.onload = () => img.classList.add('photo-lightbox-img-visible')
      }

      lightbox.classList.add('open')
      lightbox.setAttribute('aria-hidden', 'false')
    }

    // ===== CLOSE HANDLERS =====
    function closePlayback() {
      const overlay = document.getElementById('playback-overlay')
      const embed = document.getElementById('playback-embed')
      const caption = document.getElementById('playback-caption')
      const overlayCopy = document.getElementById('playback-video-overlay-copy')

      overlay.classList.remove('open', 'playback-overlay--work', 'playback-overlay--beograd')
      overlay.setAttribute('aria-hidden', 'true')
      if (embed) embed.innerHTML = ''
      if (caption) caption.innerHTML = ''
      if (overlayCopy) overlayCopy.innerHTML = ''
    }

    function closePhotoLightbox() {
      const lightbox = document.getElementById('photo-lightbox')
      lightbox.classList.remove('open')
      lightbox.setAttribute('aria-hidden', 'true')
    }

    // ===== EVENT LISTENERS =====
    // Navigation
    document.querySelectorAll('.header-nav a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        const view = a.dataset.view
        window.location.hash = view === 'work' ? '' : view
        setView(view)
        closeMenu()
      })
    })

    // Mobile menu
    const menuBtn = document.querySelector('.header-menu-btn')
    const header = document.getElementById('header')

    function toggleMenu() {
      header.classList.toggle('menu-open')
      menuBtn.setAttribute('aria-expanded', header.classList.contains('menu-open'))
    }

    function closeMenu() {
      header.classList.remove('menu-open')
      menuBtn.setAttribute('aria-expanded', 'false')
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', toggleMenu)
    }

    document.addEventListener('click', (e) => {
      if (header.classList.contains('menu-open') && !header.contains(e.target)) {
        closeMenu()
      }
    })

    // Video tile clicks
    document.querySelectorAll('.grid-item[data-video-type]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        window.openVideoPlayback(item)
      })
    })

    // Photo tile clicks
    document.querySelectorAll('.photo-item[data-photo-src]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        openPhoto(item.getAttribute('data-photo-src'))
      })
    })

    // Photo lightbox prev/next
    let currentPhotoIndex = 0
    document.querySelectorAll('.photo-item[data-photo-src]').forEach((item, i) => {
      item.addEventListener('click', () => { currentPhotoIndex = i })
    })

    document.querySelector('.photo-lightbox-prev')?.addEventListener('click', () => {
      const visibleItems = photoItems.filter(el => el.offsetParent !== null)
      if (visibleItems.length === 0) return
      currentPhotoIndex = (currentPhotoIndex - 1 + visibleItems.length) % visibleItems.length
      openPhoto(visibleItems[currentPhotoIndex].getAttribute('data-photo-src'))
    })

    document.querySelector('.photo-lightbox-next')?.addEventListener('click', () => {
      const visibleItems = photoItems.filter(el => el.offsetParent !== null)
      if (visibleItems.length === 0) return
      currentPhotoIndex = (currentPhotoIndex + 1) % visibleItems.length
      openPhoto(visibleItems[currentPhotoIndex].getAttribute('data-photo-src'))
    })

    // Close buttons
    document.querySelector('.playback-close')?.addEventListener('click', closePlayback)
    document.querySelector('.photo-lightbox-close')?.addEventListener('click', closePhotoLightbox)

    // Close on backdrop click
    document.getElementById('playback-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closePlayback()
    })

    document.getElementById('photo-lightbox')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closePhotoLightbox()
    })

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('playback-overlay').classList.contains('open')) {
          closePlayback()
        } else if (document.getElementById('photo-lightbox').classList.contains('open')) {
          closePhotoLightbox()
        }
      }
    })

    // ===== VIDEO OPTIMIZATION =====
    const videos = document.querySelectorAll('video')
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {})
        } else {
          entry.target.pause()
        }
      })
    }, { threshold: 0.1, rootMargin: '50px' })

    videos.forEach(v => videoObserver.observe(v))

    // ===== SCROLL HANDLER =====
    let ticking = false
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false
        })
        ticking = true
      }
    })

    // ===== IMAGE LOADING OPTIMIZATION =====
    const images = document.querySelectorAll('.grid-image img')
    images.forEach(img => {
      if (!img.complete) {
        img.style.opacity = '0'
        img.onload = () => {
          img.style.transition = 'opacity 0.3s ease'
          img.style.opacity = '1'
        }
      }
    })

    // Initialize view
    setView(getView())

    window.addEventListener('hashchange', () => {
      setView(getView())
    })

    // ===== SAFARI OPTIMIZATIONS =====
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
                     /iPad|iPhone|iPod/.test(navigator.userAgent)

    if (isSafari) {
      document.body.classList.add('safari')

      const style = document.createElement('style')
      style.textContent = `
        video::-webkit-media-controls,
        video::-webkit-media-controls-panel,
        video::-webkit-media-controls-play-button,
        video::-webkit-media-controls-start-playback-button,
        video::-webkit-media-controls-overlay-play-button,
        video::-webkit-media-controls-enclosure,
        video::-webkit-media-controls-timeline,
        video::-webkit-media-controls-current-time-display,
        video::-webkit-media-controls-time-remaining-display,
        video::-webkit-media-controls-toggle-closed-captions-button,
        video::-webkit-media-controls-fullscreen-button,
        video::-webkit-media-controls-volume-slider,
        video::-webkit-media-controls-mute-button {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          visibility: hidden !important;
        }

        video {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none;
        }

        .grid-image-inner-wrapper {
          position: relative;
        }

        .video-tap-overlay {
          display: block !important;
          position: absolute;
          inset: 0;
          z-index: 20;
          cursor: pointer;
          background: transparent;
          -webkit-tap-highlight-color: transparent;
        }

        .grid-image-inner-wrapper,
        video {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        video {
          image-rendering: -webkit-optimize-contrast;
        }
      `
      document.head.appendChild(style)

      document.querySelectorAll('video').forEach(video => {
        video.style.webkitTransform = 'translateZ(0)'
        video.style.transform = 'translateZ(0)'
        video.muted = true
        video.setAttribute('muted', '')
        video.removeAttribute('controls')
        video.controls = false

        const mp4Source = video.querySelector('source[type="video/mp4"]')
        if (mp4Source && video.children.length > 1) {
          video.src = mp4Source.src
          video.load()
        }

        const wrapper = video.closest('.grid-image-inner-wrapper')
        if (wrapper && !wrapper.querySelector('.video-tap-overlay')) {
          const tapOverlay = document.createElement('div')
          tapOverlay.className = 'video-tap-overlay'
          tapOverlay.setAttribute('aria-hidden', 'true')
          tapOverlay.addEventListener('click', (e) => {
            e.preventDefault()
            const gridItem = wrapper.closest('.grid-item')
            if (gridItem && gridItem.dataset.videoType && gridItem.dataset.videoId) {
              window.openVideoPlayback?.(gridItem)
            }
          })
          wrapper.appendChild(tapOverlay)
        }
      })

      const safariVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const video = entry.target
          if (entry.isIntersecting) {
            setTimeout(() => { video.play().catch(() => {}) }, 100)
          } else {
            video.pause()
          }
        })
      }, { threshold: 0.1, rootMargin: '50px' })

      document.querySelectorAll('video').forEach(v => safariVideoObserver.observe(v))

      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.querySelectorAll('video source[type="video/webm"]').forEach(source => {
          source.parentElement.removeChild(source)
        })
      }
    }
  }, [])

  return (
    <>
      <PlaybackOverlay />

      {/* Photo lightbox */}
      <PhotoLightbox />

      <Header />

      <main id="page" role="main">
        <p className="page-section-label" id="page-section-label" aria-hidden="true">FEATURED WORK</p>

        {/* Mobile fallback */}
        <div className="mobile-featured-fallback" aria-hidden="false">
          <VideoGridItem className="film-beograd featured featured-1" href="#" videoType="youtube" videoId="pR-9xte4bgg" caption="BEOGRAD">
            <video className="mobile-fallback-video grid-loop-video" autoPlay loop muted playsInline preload="auto" fetchPriority="high">
              <source src="/videos/beogradintroclip-compressed.webm" type="video/webm" />
              <source src="/videos/beogradintroclip.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>
          <VideoGridItem className="grid-item-aspect-3-2 film-deja-vu featured featured-2" href="#" videoType="vimeo" videoId="799266927" caption="DEJA VU LIQUOR">
            <img className="dejavu-safari-thumb" src="/images/dejavuliquorthumbnailbackup.jpg" alt="" loading="lazy" decoding="async" />
            <video className="mobile-fallback-video grid-loop-video" autoPlay loop muted playsInline preload="metadata">
              <source src="/videos/dejavushortofficial.webm" type="video/webm" />
              <source src="/videos/dejavushortofficial.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>
          <VideoGridItem className="film-starling featured featured-3" href="#" videoType="youtube" videoId="H31T2RClBi4" caption="STARLING">
            <img className="starling-safari-thumb" src="/images/starlingbackupthumbnail.jpg" alt="" loading="lazy" decoding="async" />
            <video className="mobile-fallback-video grid-loop-video" autoPlay loop muted playsInline preload="metadata">
              <source src="/videos/starling-1.webm" type="video/webm" />
              <source src="/videos/starling-1.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>
          <VideoGridItem className="film-hero featured featured-4" href="#" videoType="youtube" videoId="i10I_Eh5Zgo" caption="HERO">
            <img className="hero-safari-thumb" src="/images/herophototif.png" alt="" loading="lazy" decoding="async" />
            <video className="mobile-fallback-video grid-loop-video" autoPlay loop muted playsInline preload="metadata">
              <source src="/videos/hero-loop.webm" type="video/webm" />
              <source src="/videos/hero-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>
          <div className="photo-item featured featured-5" data-photo-src="/images/1.jpg">
            <img src="/images/1.jpg" alt="" />
            <span className="film-item-caption">Photo</span>
          </div>
          <VideoGridItem className="grid-item-aspect-3-2 film-colourtrax featured featured-6" href="#" videoType="vimeo" videoId="1131852040" caption="COLOURTRAX">
            <img className="colourtrax-safari-thumb" src="/images/colourtraxthumbnailbackup.jpg" alt="" loading="lazy" decoding="async" />
            <video className="mobile-fallback-video grid-loop-video" autoPlay loop muted playsInline preload="metadata">
              <source src="/videos/colourtraxforwebm.webm" type="video/webm" />
              <source src="/videos/colourtraxforwebm.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>
        </div>

        {/* Info placeholder */}
        <InfoPlaceholder />

        {/* Main grid */}
        <div className="grid-wrapper">
          <VideoGridItem className="film-beograd featured featured-1" href="#" videoType="youtube" videoId="pR-9xte4bgg" caption="BEOGRAD">
            <img className="beograd-film-cover" src="/images/beograd-16x9-cover.jpg" alt="" loading="lazy" decoding="async" />
            <video id="beograd-video" className="grid-loop-video" autoPlay loop muted playsInline preload="auto" fetchPriority="high">
              <source src="/videos/beogradintroclip-compressed.webm" type="video/webm" />
              <source src="/videos/beogradintroclip.mp4" type="video/mp4" />
            </video>
            <video className="grid-loop-video beograd-film-trailer" autoPlay loop muted playsInline preload="metadata">
              <source src="/videos/beograd-trailer-shortened-hd.webm" type="video/webm" />
            </video>
          </VideoGridItem>
          <VideoGridItem className="grid-item-aspect-3-2 film-deja-vu featured featured-2" href="#" videoType="vimeo" videoId="799266927" caption="DEJA VU LIQUOR">
            <img className="dejavu-safari-thumb" src="/images/dejavuliquorthumbnailbackup.jpg" alt="" loading="lazy" decoding="async" />
            <video className="grid-loop-video" autoPlay loop muted playsInline preload="metadata">
              <source src="/videos/dejavushortofficial.webm" type="video/webm" />
              <source src="/videos/dejavushortofficial.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>
          <VideoGridItem className="film-starling featured featured-3" href="#" videoType="youtube" videoId="H31T2RClBi4" caption="STARLING">
            <img className="starling-safari-thumb" src="/images/starlingbackupthumbnail.jpg" alt="" loading="lazy" decoding="async" />
            <video className="grid-loop-video" autoPlay loop muted playsInline preload="metadata">
              <source src="/videos/starling-1.webm" type="video/webm" />
              <source src="/videos/starling-1.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>
          <VideoGridItem className="film-hero featured featured-4" href="#" videoType="youtube" videoId="i10I_Eh5Zgo" caption="HERO">
            <img className="hero-safari-thumb" src="/images/herophototif.png" alt="" loading="lazy" decoding="async" />
            <video className="grid-loop-video" autoPlay loop muted playsInline preload="metadata">
              <source src="/videos/hero-loop.webm" type="video/webm" />
              <source src="/videos/hero-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>
          <VideoGridItem className="film-freefall" href="javascript:void(0)" videoType="youtube" videoId="YE8l-5BAG1I" caption="FREEFALL">
            <video className="grid-loop-video" autoPlay loop muted playsInline preload="metadata" poster="https://img.youtube.com/vi/YE8l-5BAG1I/maxresdefault.jpg">
              <source src="/videos/freefall-1.webm" type="video/webm" />
            </video>
          </VideoGridItem>
          <VideoGridItem className="film-winter" href="javascript:void(0)" videoType="youtube" videoId="OjzvAPvmASw" caption="Winter">
            <video className="grid-loop-video" autoPlay loop muted playsInline preload="metadata" poster="https://img.youtube.com/vi/OjzvAPvmASw/maxresdefault.jpg">
              <source src="/videos/winter.webm" type="video/webm" />
            </video>
          </VideoGridItem>
          <VideoGridItem className="film-odd-day" href="javascript:void(0)" videoType="youtube" videoId="E6EhtnpuW24" caption="ODD DAY">
            <video className="grid-loop-video" autoPlay loop muted playsInline preload="metadata" poster="https://img.youtube.com/vi/E6EhtnpuW24/maxresdefault.jpg">
              <source src="/videos/odd-day-segment-2.webm" type="video/webm" />
            </video>
          </VideoGridItem>
          <PhotoItem className="featured featured-5" photoSrc="/images/1.jpg" src="/images/1.jpg" />
          <VideoGridItem className="grid-item-aspect-3-2 film-colourtrax featured featured-6" href="#" videoType="vimeo" videoId="1131852040" caption="COLOURTRAX">
            <img className="colourtrax-safari-thumb" src="/images/colourtraxthumbnailbackup.jpg" alt="" loading="lazy" decoding="async" />
            <video className="grid-loop-video" autoPlay loop muted playsInline preload="metadata">
              <source src="/videos/colourtraxforwebm.webm" type="video/webm" />
              <source src="/videos/colourtraxforwebm.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>
          <PhotoItem className="photo-tab-only" photoSrc="/images/1.jpg" src="/images/1.jpg" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/3.jpg" src="/images/3.jpg" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/billboard-frost-children.png" src="/images/billboard-frost-children.png" alt="Billboard frost children" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/2.jpg" src="/images/2.jpg" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/julie-nme-images.png" src="/images/julie-nme-images.png" alt="Julie NME images" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/2girlsofficial.png" src="/images/2girlsofficial.png" alt="2 girls official" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/hongkonganime.JPG" src="/images/hongkonganime.JPG" alt="Hong Kong anime" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/catherine.webp" src="/images/catherine.webp" alt="Catherine" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/2girls-from-hero-jpg.webp" src="/images/2girls-from-hero-jpg.webp" alt="2 girls from hero" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/herophototif.png" src="/images/herophototif.png" alt="Hero" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/colourtrax-edgy.webp" src="/images/colourtrax-edgy.webp" alt="Colourtrax edgy" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/colourtrax-cloe.webp" src="/images/colourtrax-cloe.webp" alt="Colourtrax cloe" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/sofia.webp" src="/images/sofia.webp" alt="Sofia" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/JULIEmain.webp" src="/images/JULIEmain.webp" alt="Sofia" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/frost-billboard.webp" src="/images/frost-billboard.webp" />
        </div>
      </main>
    </>
  )
}
