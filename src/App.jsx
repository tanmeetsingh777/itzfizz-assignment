import { useEffect, useRef } from 'react'
import './App.css'

/*
 * GSAP + ScrollTrigger are loaded via <script> tags in index.html (CDN).
 * We grab them from the window object so Vite's module bundler is not
 * involved and there are no npm install requirements.
 */

/* ── Letter data ── */
const HEADLINE = ['W','E','L','C','O','M','E',' ','I','T','Z','F','I','Z','Z']

/* ── Stat card data ── */
const STATS = [
  {
    id: 'box1',
    value: '58%',
    label: 'Increase in pick-up point use',
    style: { top: '8%', right: '32%' },
  },
  {
    id: 'box2',
    value: '23%',
    label: 'Decrease in customer phone calls',
    style: { bottom: '8%', right: '36%' },
  },
  {
    id: 'box3',
    value: '27%',
    label: 'Increase in active users monthly',
    style: { top: '8%', right: '8%' },
  },
  {
    id: 'box4',
    value: '40%',
    label: 'Decrease in delivery complaints',
    style: { bottom: '8%', right: '10%' },
  },
]

/* ============================================================
   HeroSection
   ============================================================ */
function HeroSection() {
  const sectionRef = useRef(null)
  const carRef     = useRef(null)
  const trailRef   = useRef(null)
  const valueRef   = useRef(null)

  useEffect(() => {
    /* Pull GSAP from window – loaded by CDN scripts in index.html */
    const gsap          = window.gsap
    const ScrollTrigger = window.ScrollTrigger

    if (!gsap || !ScrollTrigger) {
      console.warn('GSAP not loaded yet – CDN scripts may still be loading.')
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const section   = sectionRef.current
    const car       = carRef.current
    const trail     = trailRef.current
    const valueWrap = valueRef.current

    if (!section || !car || !trail || !valueWrap) return

    const ctx = gsap.context(() => {
      /* ── 1. Text Elements ── */
      const letters = valueWrap.querySelectorAll('.value-letter')

      /* ── 2. Dimensions (measured once, not on every frame) ── */
      const CAR_WIDTH     = 200 // Hardcoded to match the CSS width of the car
      const roadWidth     = window.innerWidth
      const endX          = roadWidth // Drive completely off the right edge
      const valueRect     = valueWrap.getBoundingClientRect()
      const letterOffsets = Array.from(letters).map(el => el.offsetLeft)

      /* ── 3. Scroll-driven car drive ── */
      gsap.set(car, { yPercent: -50 })
      gsap.to(car, {
        x: endX,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end:   'bottom top',
          scrub: 2,
          pin:   '.track',
          anticipatePin: 1,
          onUpdate() {
            const carX = gsap.getProperty(car, 'x') + CAR_WIDTH / 2

            /* Grow trail behind the car */
            gsap.set(trail, { width: carX })

            /* Reveal letters dynamically with GSAP */
            letters.forEach((letter, i) => {
              const lx = valueRect.left + letterOffsets[i]
              const isRevealed = (carX + 50 >= lx)
              
              const targetState = isRevealed ? 'on' : 'off'
              if (letter.dataset.state !== targetState) {
                letter.dataset.state = targetState
                gsap.to(letter, {
                  opacity: isRevealed ? 1 : 0,
                  y: isRevealed ? 0 : 40,
                  duration: 0.4,
                  ease: 'back.out(1.5)',
                  overwrite: 'auto'
                })
              }
            })
          },
        },
      })

      /* ── 4. Stat boxes: fade one by one as scroll progresses ── */
      const SCROLL_OFFSETS = [500, 800, 1100, 1400]
      STATS.forEach(({ id }, i) => {
        gsap.to(`#${id}`, {
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: `top+=${SCROLL_OFFSETS[i]} top`,
            end:   `top+=${SCROLL_OFFSETS[i] + 300} top`,
            scrub: 1.5,
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div className="section" ref={sectionRef}>
      <div className="track">

        {/* ── Road strip ── */}
        <div className="road" id="road">
          {/* Green trail */}
          <div className="trail" ref={trailRef} />

          {/* Car Wrapper */}
          <div
            ref={carRef}
            className="car-wrapper"
            id="car"
          >
            <img
              src="/car.png"
              alt="ItzFizz car"
              className="car-img"
              draggable={false}
            />
          </div>

          {/* Headline: W E L C O M E  I T Z F I Z Z */}
          <div className="value-add" ref={valueRef} id="valueText">
            {HEADLINE.map((letter, i) => (
              <span key={i} className="value-letter">
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
        </div>

        {/* ── Stat boxes ── */}
        {STATS.map(({ id, value, label, style }) => (
          <div key={id} className="text-box" id={id} style={style}>
            <span className="num-box">{value}</span>
            {label}
          </div>
        ))}

      </div>
    </div>
  )
}

/* ============================================================
   Root App
   ============================================================ */
function App() {
  return (
    <>
      <HeroSection />
      <div className="after-section">ITZFIZZ</div>
    </>
  )
}

export default App
