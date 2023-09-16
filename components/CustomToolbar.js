import React from 'react';

const CustomToolbar = ({ position, color, onBoldClick, onItalicClick, onUnderlineClick }) => {
  const toolbarStyle = {
    backgroundColor: color,
    position: position,
  };

  return (
    <div style={toolbarStyle}>
      <button onClick={onBoldClick}>Bold</button>
      <button onClick={onItalicClick}>Italic</button>
      <button onClick={onUnderlineClick}>Underline</button>
    </div>
  );
};

export default CustomToolbar;