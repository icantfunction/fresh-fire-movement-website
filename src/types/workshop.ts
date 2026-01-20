export interface WorkshopRegistrationPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  yearsAtClc: number;
  encounterCollide: boolean;
  dateOfBirth: string;
  grade: string;
  audition: boolean;
}

export interface WorkshopRegistrationResponse {
  ok: boolean;
  registrationId: string;
}
