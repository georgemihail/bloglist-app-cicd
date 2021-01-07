import React from 'react'

const Notification = ({message, success}) => {
    if (!message) {
        return null
    }

    const successMessage = {
        color: 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
    }

    const faildMessage = {
        color: 'red',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
    }
    
    return (
        <div style={success ? successMessage : faildMessage} id="error">
            {message}
        </div>
    )
}

export default Notification