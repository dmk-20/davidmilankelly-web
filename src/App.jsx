import { useEffect, useRef } from 'react'
import PhotoLightbox from './components/PhotoLightbox.jsx'
import Header from './components/Header.jsx'
import InfoPlaceholder from './components/InfoPlaceholder.jsx'
import PlaybackOverlay from './components/PlaybackOverlay.jsx'
import VideoGridItem from './components/VideoGridItem'
import PhotoItem from './components/PhotoItem'
import { videoPosters } from './videoPosters.js'
import { photoPosters } from './photoPosters.js'

export default function App() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // ===== VIDEO ITEM TRACKING =====
    const videoItems = Array.from(document.querySelectorAll('.grid-item[data-video-type]'))
    let currentVideoIndex = 0

    // ===== SIMPLE VIEW MANAGER =====
    const viewLabels = { work: 'featured', film: 'film', photo: 'photography' }
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
        restartLoopsForView(view)
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

    let skipNextLoopRestart = true

    function restartLoopsForView(view) {
      if (view !== 'work' && view !== 'film') return
      if (skipNextLoopRestart) {
        skipNextLoopRestart = false
        return
      }
      const loops = document.querySelectorAll('.grid-wrapper .grid-loop-video')
      loops.forEach((video) => {
        try {
          video.muted = true
          video.setAttribute('muted', '')
          video.pause()
          video.currentTime = 0
          video.play().catch(() => {})
        } catch (e) {}
      })
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
        ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&cc_load_policy=0&cc_lang_pref=en&iv_load_policy=3`
        : type === 'vimeo'
          ? `https://player.vimeo.com/video/${id}?autoplay=1`
          : ''

      if (!src) return false

      const visibleVideoItems = videoItems.filter(el => el.offsetParent !== null)
      const vIdx = visibleVideoItems.indexOf(link)
      if (vIdx !== -1) currentVideoIndex = vIdx

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

      const isDejaVu = id === '799266927' || link.classList.contains('film-deja-vu')
      const projectName = isBeograd
        ? 'BEOGRAD – OSCAR QUALIFYING SHORT FILM'
        : isDejaVu
          ? 'DEJA VU LIQUOR – SHORT FILM'
          : (link.getAttribute('title') ||
            (link.querySelector('.film-item-caption') && link.querySelector('.film-item-caption').textContent) || '')

      if (captionEl) {
        captionEl.innerHTML = projectName ? `<span class="playback-caption-project">${projectName}</span>` : ''
      }

      if (overlayCopy) overlayCopy.innerHTML = ''

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
    document.querySelectorAll('.header-nav a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        const view = a.dataset.view
        window.location.hash = view === 'work' ? '' : view
        setView(view)
        closeMenu()
      })
    })

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

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu)

    document.addEventListener('click', (e) => {
      if (header.classList.contains('menu-open') && !header.contains(e.target)) {
        closeMenu()
      }
    })

    document.querySelectorAll('.grid-item[data-video-type]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        window.openVideoPlayback(item)
      })
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          window.openVideoPlayback(item)
        }
      })
    })

    let currentPhotoIndex = 0
    document.querySelectorAll('.photo-item[data-photo-src]').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        const visibleItems = photoItems.filter(el => el.offsetParent !== null)
        const idx = visibleItems.indexOf(item)
        currentPhotoIndex = idx !== -1 ? idx : 0
        openPhoto(item.getAttribute('data-photo-src'))
      })
    })

    document.querySelector('.photo-lightbox-prev')?.addEventListener('click', () => {
      const visibleItems = photoItems.filter(el => el.offsetParent !== null)
      if (!visibleItems.length) return
      currentPhotoIndex = (currentPhotoIndex - 1 + visibleItems.length) % visibleItems.length
      openPhoto(visibleItems[currentPhotoIndex].getAttribute('data-photo-src'))
    })

    document.querySelector('.photo-lightbox-next')?.addEventListener('click', () => {
      const visibleItems = photoItems.filter(el => el.offsetParent !== null)
      if (!visibleItems.length) return
      currentPhotoIndex = (currentPhotoIndex + 1) % visibleItems.length
      openPhoto(visibleItems[currentPhotoIndex].getAttribute('data-photo-src'))
    })

    document.querySelector('.playback-prev')?.addEventListener('click', () => {
      const visibleVideoItems = videoItems.filter(el => el.offsetParent !== null)
      if (!visibleVideoItems.length) return
      currentVideoIndex = (currentVideoIndex - 1 + visibleVideoItems.length) % visibleVideoItems.length
      window.openVideoPlayback(visibleVideoItems[currentVideoIndex])
    })

    document.querySelector('.playback-next')?.addEventListener('click', () => {
      const visibleVideoItems = videoItems.filter(el => el.offsetParent !== null)
      if (!visibleVideoItems.length) return
      currentVideoIndex = (currentVideoIndex + 1) % visibleVideoItems.length
      window.openVideoPlayback(visibleVideoItems[currentVideoIndex])
    })

    document.querySelector('.playback-close')?.addEventListener('click', closePlayback)
    document.querySelector('.photo-lightbox-close')?.addEventListener('click', closePhotoLightbox)

    document.getElementById('playback-overlay')?.addEventListener('click', (e) => {
      if (!e.target.closest('.playback-prev, .playback-next, .playback-inner')) closePlayback()
    })

    document.getElementById('photo-lightbox')?.addEventListener('click', (e) => {
      if (!e.target.closest('.photo-lightbox-prev, .photo-lightbox-next, #photo-lightbox-img')) closePhotoLightbox()
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('playback-overlay').classList.contains('open')) {
          closePlayback()
        } else if (document.getElementById('photo-lightbox').classList.contains('open')) {
          closePhotoLightbox()
        }
      }
    })

    // ===== VIDEO INTERSECTION OBSERVER =====
    const isFeaturedWorkLoop = (video) =>
      document.body.classList.contains('view-work') &&
      Boolean(video.closest('.grid-item.featured'))

    const resumeLoop = (video) => {
      if (!video?.isConnected) return
      video.muted = true
      video.setAttribute('muted', '')
      if (video.readyState >= 2) {
        video.play().catch(() => {})
      }
    }

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target
        if (entry.isIntersecting) {
          resumeLoop(video)
        } else if (!isFeaturedWorkLoop(video)) {
          video.pause()
        }
      })
    }, { threshold: 0, rootMargin: '250px' })

    document.querySelectorAll('.grid-wrapper .grid-loop-video').forEach((video) => {
      videoObserver.observe(video)
      video.addEventListener('ended', () => resumeLoop(video))
    })

    // ===== SCROLL HANDLER =====
    let ticking = false
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { ticking = false })
        ticking = true
      }
    })

    // ===== IMAGE LOADING =====
    // PhotoItem components manage their own full-loaded class via onLoad prop.
    // This handles any remaining .grid-image img elements (e.g. mobile fallback).
    document.querySelectorAll('.mobile-featured-fallback .grid-image img').forEach(img => {
      const wrapper = img.closest('.grid-image-inner-wrapper')
      const markLoaded = () => wrapper?.classList.add('full-loaded')
      if (img.complete) {
        requestAnimationFrame(markLoaded)
      } else {
        img.addEventListener('load', () => requestAnimationFrame(markLoaded), { once: true })
      }
    })

    // Initialize view
    setView(getView())
    window.addEventListener('hashchange', () => setView(getView()))

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
        video { -webkit-appearance: none; appearance: none; pointer-events: none; }
        .grid-image-inner-wrapper { position: relative; }
        .video-tap-overlay {
          display: block !important;
          position: absolute;
          inset: 0;
          z-index: 20;
          cursor: pointer;
          background: transparent;
          -webkit-tap-highlight-color: transparent;
        }
        .grid-image-inner-wrapper, video {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        video { image-rendering: -webkit-optimize-contrast; }
      `
      document.head.appendChild(style)

      document.querySelectorAll('video').forEach(video => {
        video.style.webkitTransform = 'translateZ(0)'
        video.style.transform = 'translateZ(0)'
        video.muted = true
        video.setAttribute('muted', '')
        video.removeAttribute('controls')
        video.controls = false

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

      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.querySelectorAll('video source[type="video/webm"]').forEach(source => {
          source.parentElement.removeChild(source)
        })
      }
    }

    // ===== VIDEO LOADING =====
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    const applyPreferredSources = (video) => {
      const webm = video.querySelector('source[type="video/webm"]')
      const mp4 = video.querySelector('source[type="video/mp4"]')
      if (isSafari || isIOS) {
        if (mp4?.src) {
          video.src = mp4.src
          if (webm) webm.remove()
        } else if (webm?.src) {
          // Keep WebM if no MP4 exists rather than leaving an empty cell
          video.src = webm.src
        }
        return
      }

      // Desktop Chrome/Firefox: WebM only (smaller, smoother loops — especially My Chalice)
      if (webm?.src) {
        video.src = webm.src
        if (mp4) mp4.remove()
        return
      }

      if (mp4?.src) video.src = mp4.src
    }

    const loadVideo = (video) => {
      if (video.dataset.loadStarted) return
      video.dataset.loadStarted = '1'

      const wrapper = video.closest('.grid-image-inner-wrapper')
      applyPreferredSources(video)

      if (!video.src && !video.querySelector('source')) {
        wrapper?.classList.add('full-loaded')
        return
      }

      let playbackStarted = false
      const startPlayback = () => {
        if (playbackStarted) return
        playbackStarted = true
        resumeLoop(video)
        wrapper?.classList.add('full-loaded')
      }

      video.addEventListener('canplaythrough', startPlayback, { once: true })
      video.addEventListener('canplay', startPlayback, { once: true })
      video.addEventListener('error', () => {
        wrapper?.classList.add('full-loaded')
      }, { once: true })

      video.preload = 'auto'
      video.load()
    }

    const loadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo(entry.target)
          loadObserver.unobserve(entry.target)
        }
      })
    }, { rootMargin: '200px' })

    document.querySelectorAll('.grid-wrapper .grid-loop-video').forEach(video => {
      loadObserver.observe(video)
    })

  }, [])

  return (
    <>
      <PlaybackOverlay />
      <PhotoLightbox />
      <Header />

      <main id="page" role="main">
        <p className="page-section-label" id="page-section-label" aria-hidden="true">featured</p>

        <InfoPlaceholder />

        {/* Main grid */}
        <div className="grid-wrapper">
          <VideoGridItem className="film-beograd featured featured-1" href="#" videoType="youtube" videoId="pR-9xte4bgg" caption="BEOGRAD – OSCAR QUALIFYING SHORT FILM">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.beograd})` }} />
            <img className="beograd-film-cover" src="/images/beograd-16x9-cover.jpg" alt="" loading="lazy" decoding="async" />
            <video id="beograd-video" className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/beograd-loop.webm" type="video/webm" />
              <source src="/videos/beograd-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="grid-item-aspect-3-2 film-deja-vu featured featured-2" href="#" videoType="vimeo" videoId="799266927" caption="DEJA VU LIQUOR – SHORT FILM">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.dejavu})` }} />
            <video className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/dejavu-loop.webm" type="video/webm" />
              <source src="/videos/dejavu-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="film-chalice featured featured-3" href="#" videoType="youtube" videoId="g7MHFBu0PI8" caption="MY CHALICE">
            <div className="grid-blur-poster" style={{ backgroundImage: 'url(https://img.youtube.com/vi/g7MHFBu0PI8/maxresdefault.jpg)' }} />
            <video
              className="grid-loop-video"
              loop
              muted
              playsInline
              preload="none"
              poster="https://img.youtube.com/vi/g7MHFBu0PI8/maxresdefault.jpg"
            >
              <source src="/videos/chalice-loop.webm" type="video/webm" />
              <source src="/videos/chalice-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="film-djdave featured featured-4" href="#" videoType="vimeo" videoId="1215676076" caption="DJ DAVE – NEXT TO U">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.djdave})` }} />
            <video className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/djdave-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="film-crush featured featured-5" href="#" videoType="youtube" videoId="FuITBKOgLKo" caption="CRUSH">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.crush})` }} />
            <video className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/crush-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="film-starling" href="#" videoType="youtube" videoId="H31T2RClBi4" caption="STARLING">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.starling})` }} />
            <video className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/starling-loop.webm" type="video/webm" />
              <source src="/videos/starling-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="film-hero featured featured-6" href="#" videoType="youtube" videoId="i10I_Eh5Zgo" caption="HERO">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.hero})` }} />
            <video className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/hero-loop.webm" type="video/webm" />
              <source src="/videos/hero-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="film-freefall" href="#" videoType="youtube" videoId="YE8l-5BAG1I" caption="FREEFALL">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.freefall})` }} />
            <video className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/freefall-loop.webm" type="video/webm" />
              <source src="/videos/freefall-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="film-winter" href="#" videoType="youtube" videoId="OjzvAPvmASw" caption="Winter">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.winter})` }} />
            <video className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/winter-loop.webm" type="video/webm" />
              <source src="/videos/winter-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="film-odd-day" href="#" videoType="youtube" videoId="E6EhtnpuW24" caption="ODD DAY">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.odd_day})` }} />
            <video className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/odd-day-loop.webm" type="video/webm" />
              <source src="/videos/odd-day-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <VideoGridItem className="grid-item-aspect-3-2 film-colourtrax" href="#" videoType="vimeo" videoId="1131852040" caption="COLOURTRAX">
            <div className="grid-blur-poster" style={{ backgroundImage: `url(${videoPosters.colourtrax})` }} />
            <video className="grid-loop-video" loop muted playsInline preload="none">
              <source src="/videos/colourtrax-loop.webm" type="video/webm" />
              <source src="/videos/colourtrax-loop.mp4" type="video/mp4" />
            </video>
          </VideoGridItem>

          <PhotoItem className="photo-tab-only" photoSrc="/images/1.jpg" src="/images/1.jpg" poster={photoPosters['1']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/3.jpg" src="/images/3.jpg" poster={photoPosters['3']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/billboard-frost-children.png" src="/images/billboard-frost-children.png" alt="Billboard frost children" poster={photoPosters['billboard_frost_children']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/2.jpg" src="/images/2.jpg" poster={photoPosters['2']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/julie-nme-images.png" src="/images/julie-nme-images.png" alt="Julie NME images" poster={photoPosters['julie_nme_images']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/catfish-parkinglot.jpg" src="/images/catfish-parkinglot.jpg" alt="Catfish parking lot" />
          <PhotoItem className="photo-tab-only" photoSrc="/images/2girlsofficial.png" src="/images/2girlsofficial.png" alt="2 girls official" poster={photoPosters['2girlsofficial']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/hongkonganime.JPG" src="/images/hongkonganime.JPG" alt="Hong Kong anime" poster={photoPosters['hongkonganime']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/catherine.webp" src="/images/catherine.webp" alt="Catherine" poster={photoPosters['catherine']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/2girls-from-hero-jpg.webp" src="/images/2girls-from-hero-jpg.webp" alt="2 girls from hero" poster={photoPosters['2girls_from_hero_jpg']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/herophototif.png" src="/images/herophototif.png" alt="Hero" poster={photoPosters['herophototif']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/colourtrax-edgy.webp" src="/images/colourtrax-edgy.webp" alt="Colourtrax edgy" poster={photoPosters['colourtrax_edgy']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/colourtrax-cloe.webp" src="/images/colourtrax-cloe.webp" alt="Colourtrax cloe" poster={photoPosters['colourtrax_cloe']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/sofia.webp" src="/images/sofia.webp" alt="Sofia" poster={photoPosters['sofia']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/JULIEmain.webp" src="/images/JULIEmain.webp" alt="Sofia" poster={photoPosters['juliemain']} />
          <PhotoItem className="photo-tab-only" photoSrc="/images/frost-billboard.webp" src="/images/frost-billboard.webp" poster={photoPosters['frost_billboard']} />
        </div>
      </main>
    </>
  )
}
