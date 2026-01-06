import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">
            © {new Date().getFullYear()} Paradigm Shift Software Development, LLC
          </p>
          <p className="footer-tagline">
            Making the right early technology decisions
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

