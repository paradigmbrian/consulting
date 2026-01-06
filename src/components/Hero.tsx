import { HiLightBulb } from 'react-icons/hi'
import './Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-icon">
            <HiLightBulb />
          </div>
          <p className="hero-brand">Paradigm Shift — Early-Stage Tech Consulting</p>
          <h1 className="hero-title">
            Technical Strategy for Non-Technical Founders Building B2C SaaS
          </h1>
          <p className="hero-subtitle">
            Make the right technology decisions before you write a single line of code — 
            and avoid wasting time and money rebuilding later.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero

