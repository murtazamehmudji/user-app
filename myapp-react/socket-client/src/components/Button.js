import React from 'react';

const button = (props) => (
    <button
        disabled={props.disabled}
        className={['btn', 'btn-sm', props.btn].join(' ')}
        onClick={props.clicked}>{props.children}</button>
)

export default button;