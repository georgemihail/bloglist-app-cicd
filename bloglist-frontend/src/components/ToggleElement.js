import React, {useState} from 'react'

const ToggleElement = (props) => {
    const [visible, setVisible] = useState(false)

    const hiddenWhenVisible = {
      display: visible ? 'none' : ''
    }

    const viewWhenVisible = {
      display: visible ? '' : 'none'
    }

    const toggleVisibility = () => {
      setVisible(!visible)
    }

    return (
      <div>
        <div style={hiddenWhenVisible}>
          <button onClick={toggleVisibility}>{props.label}</button>
        </div>
        <div style={viewWhenVisible}>
            {props.children}
            <div>
              <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </div>
      </div>
    )
}

export default ToggleElement