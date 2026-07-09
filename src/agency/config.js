// Reuses the exact same backend base URL the admin console already uses —
// imported, not duplicated, so there's only ever one place
// (admin/config.js) that needs updating if the backend URL ever changes.
import { API_BASE_URL } from '../admin/config';

export { API_BASE_URL };

export const AGENCY_TOKEN_KEY = 'gulgule_agency_token';
export const AGENCY_CODE_KEY = 'gulgule_agency_code';
export const AGENCY_NAME_KEY = 'gulgule_agency_name';
