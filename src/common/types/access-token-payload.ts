export type AccessTokenPayload = {
  sub: string;
  username: string;
  account_type: string;
  staff_role: string | null;
  company_uuid: string | null;
  permissions: string[];
  type: 'access';
};
