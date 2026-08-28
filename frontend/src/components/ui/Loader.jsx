import React from 'react'
import './Loader.css'

const Loader = ({ label }) => {
  return (
    <div className="loader-wrapper">
      <div className="progress-loader">
        <div className="progress" />
      </div>
      {label && <span className="loader-label">{label}</span>}
    </div>
  )
}

export default Loader
