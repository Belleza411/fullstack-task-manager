export const formatDateForInput = (dateStr: string): string => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : '';
}
