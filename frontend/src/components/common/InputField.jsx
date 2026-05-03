import React from 'react';

/**
 * Componente reutilizable de campo de entrada con etiqueta flotante.
 */
export const InputField = ({
  id,
  label,
  type,
  placeholder = " ",
  value,
  onChange,
  required = true,
  readOnly = false
}) => (
  <div className={`floating-input-group ${value ? 'has-value' : ''}`}>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);
