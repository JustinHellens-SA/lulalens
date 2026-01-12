import { useState, useEffect } from 'react'
import { getAllConditions } from '../data/healthConditions'
import './ConditionSelector.css'

function ConditionSelector({ selectedConditions, onConditionsChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const conditions = getAllConditions()

  const toggleCondition = (conditionId) => {
    if (selectedConditions.includes(conditionId)) {
      onConditionsChange(selectedConditions.filter(id => id !== conditionId))
    } else {
      onConditionsChange([...selectedConditions, conditionId])
    }
  }

  return (
    <div className="condition-selector">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="condition-toggle"
      >
        ⚙️ Health Conditions ({selectedConditions.length})
      </button>

      {isOpen && (
        <div className="condition-modal">
          <div className="condition-modal-content">
            <div className="condition-header">
              <h2>Select Your Health Conditions</h2>
              <button onClick={() => setIsOpen(false)} className="close-btn">✕</button>
            </div>

            <p className="condition-description">
              Choose conditions that apply to you for personalized food recommendations
            </p>

            <div className="condition-grid">
              {conditions.map(condition => (
                <div 
                  key={condition.id}
                  className={`condition-card ${selectedConditions.includes(condition.id) ? 'selected' : ''}`}
                  onClick={() => toggleCondition(condition.id)}
                >
                  <div className="condition-icon">{condition.icon}</div>
                  <h3>{condition.name}</h3>
                  <p>{condition.description}</p>
                  <div className="condition-check">
                    {selectedConditions.includes(condition.id) && '✓'}
                  </div>
                </div>
              ))}
            </div>

            <div className="condition-actions">
              <button 
                onClick={() => onConditionsChange([])} 
                className="clear-btn"
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="done-btn"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConditionSelector
