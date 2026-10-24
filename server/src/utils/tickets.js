export function ticketId(id, date = new Date()) {
  return `CC-${date.getFullYear()}-${String(id).padStart(5, '0')}`;
}
export const departmentForCategory = {
  'Infrastructure': 'Facilities', 'Wi-Fi & IT': 'IT Support', 'Cleanliness': 'Housekeeping',
  'Transport': 'Transport', 'Electrical': 'Facilities', 'Water & Plumbing': 'Facilities',
  'Safety': 'Campus Security', 'Other': 'Administration'
};
export const slaHours = { Low: 120, Medium: 72, High: 24, Urgent: 8 };
