import React from 'react';

/**
 * Componente reutilizable de selector con etiqueta flotante.
 */
export const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  required = true,
  defaultOption = 'Selecciona...'
}) => (
  <div className={`floating-input-group has-value`}>
    <select id={id} value={value} onChange={onChange} required={required}>
      <option value='' disabled>
        {defaultOption}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <label htmlFor={id}>{label}</label>
  </div>
);
