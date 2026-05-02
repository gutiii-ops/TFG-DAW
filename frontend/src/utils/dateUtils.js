/**
 * Convierte una fecha de formato ISO (YYYY-MM-DD...) a formato DD/MM/YYYY.
 */
export const formatToDisplayDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Convierte una fecha de formato DD/MM/YYYY a formato YYYY-MM-DD.
 */
export const formatToISODate = (displayDate) => {
  if (!displayDate) return '';
  const parts = displayDate.split('/');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};
