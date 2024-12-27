// remarket_frontend/src/components/Button.js
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ type, onClick, children }) => (
  <button type={type} onClick={onClick} className="btn">
    {children}
  </button>
);

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  type: 'button',
};

export default Button;