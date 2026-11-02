import { HttpErrorResponse } from '@angular/common/http';

import { AppointmentApiError } from '../models/appointment-api-error.model';

const BOOKING_CONFLICT_MESSAGE = 'This appointment slot is already booked.';

export function mapApiError(error: HttpErrorResponse): AppointmentApiError {
  const status = error.status || null;
  const body = error.error;
  const apiMessage =
    body && typeof body === 'object' && typeof body.message === 'string'
      ? body.message
      : null;
  const hasProblemDetails =
    body &&
    typeof body === 'object' &&
    (typeof body.errors === 'object' || body.type !== undefined);

  if (status === 0 || !error.status) {
    return {
      kind: 'network',
      message: 'The clinic API could not be reached.',
      status: 0,
    };
  }

  if (status === 404 && apiMessage) {
    return {
      kind: 'not-found',
      message: apiMessage,
      status,
    };
  }

  if (
    (status === 400 && apiMessage === BOOKING_CONFLICT_MESSAGE) ||
    status === 409
  ) {
    return {
      kind: 'booking-conflict',
      message: apiMessage ?? BOOKING_CONFLICT_MESSAGE,
      status,
    };
  }

  if (status === 400 && apiMessage) {
    return {
      kind: 'validation',
      message: apiMessage,
      status,
    };
  }

  if (status === 400 && hasProblemDetails) {
    return {
      kind: 'validation',
      message: 'The appointment details are not valid.',
      status,
    };
  }

  return {
    kind: 'unavailable',
    message: 'The request could not be completed.',
    status,
  };
}
