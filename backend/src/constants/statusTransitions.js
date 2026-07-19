/**
 * Role-based allowed appointment status transitions.
 *
 * Each role maps to an array of status values they are permitted to set.
 * The service layer validates every status update against these rules
 * to reject unauthorized transitions.
 *
 * The statuses themselves are defined in constants/index.js → APPOINTMENT_STATUS:
 *   pending, confirmed, rejected, checked-in, in-consultation, completed, cancelled, no-show
 *
 * Rules:
 *   super-admin — full control over the entire lifecycle (any status)
 *   reception   — check-in flow and cancellations
 *   doctor      — confirm and mark as completed (their own appointments only)
 */
export const ALLOWED_STATUS_TRANSITIONS = {
  'super-admin': [
    'pending',
    'confirmed',
    'rejected',
    'checked-in',
    'in-consultation',
    'completed',
    'cancelled',
    'no-show',
  ],
  'reception': [
    'confirmed',
    'checked-in',
    'in-consultation',
    'completed',
    'cancelled',
    'no-show',
  ],
  'doctor': [
    'confirmed',
    'completed',
  ],
};

/**
 * Check whether a given role is allowed to set a target status.
 *
 * @param {string} role - User role (super-admin, reception, doctor)
 * @param {string} targetStatus - The status being requested
 * @returns {boolean}
 */
export const isTransitionAllowed = (role, targetStatus) => {
  const allowed = ALLOWED_STATUS_TRANSITIONS[role];
  if (!allowed) return false;
  return allowed.includes(targetStatus);
};
