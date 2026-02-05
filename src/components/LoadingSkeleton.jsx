import './LoadingSkeleton.css'
import PropTypes from 'prop-types'

/**
 * Loading skeleton component for better perceived performance
 */
function LoadingSkeleton({ type = 'product' }) {
  if (type === 'product') {
    return (
      <div className="loading-skeleton">
        <div className="skeleton-header">
          <div className="skeleton-image skeleton-shimmer" />
          <div className="skeleton-title-section">
            <div className="skeleton-title skeleton-shimmer" />
            <div className="skeleton-subtitle skeleton-shimmer" />
            <div className="skeleton-subtitle skeleton-shimmer" style={{ width: '60%' }} />
          </div>
        </div>

        <div className="skeleton-section">
          <div className="skeleton-section-title skeleton-shimmer" />
          <div className="skeleton-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-item skeleton-shimmer" />
            ))}
          </div>
        </div>

        <div className="skeleton-section">
          <div className="skeleton-section-title skeleton-shimmer" />
          <div className="skeleton-text skeleton-shimmer" />
          <div className="skeleton-text skeleton-shimmer" />
          <div className="skeleton-text skeleton-shimmer" style={{ width: '80%' }} />
        </div>
      </div>
    )
  }

  return null
}

LoadingSkeleton.propTypes = {
  type: PropTypes.string
}

export default LoadingSkeleton
