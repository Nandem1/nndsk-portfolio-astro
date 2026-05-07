/**
 * Formatea una fecha en español con formato largo
 * @param date - Fecha a formatear (Date o string)
 * @param options - Opciones de formato
 * @returns Fecha formateada
 */
export function formatDateLong(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formatea una fecha en español con formato corto (para listas)
 * @param date - Fecha a formatear (Date o string)
 * @returns Fecha formateada en formato corto
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Obtiene el tiempo de lectura estimado en minutos
 * @param content - Contenido del artículo
 * @returns Tiempo de lectura en formato "X min"
 */
export function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

/**
 * Valida si una fecha es válida
 * @param date - Fecha a validar
 * @returns true si la fecha es válida
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
