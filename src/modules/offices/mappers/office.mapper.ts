import {
  toPublicCompany,
  type PublicCompany,
} from '../../companies/mappers/company.mapper.js';
import { Office } from '../entities/office.entity.js';

export type PublicOffice = {
  id: string;
  company_uuid: string;
  company: PublicCompany;
  office_code: string;
  name: string;
  address: string;
  phones: string[];
  note: string;
  created_at: Date;
  updated_at: Date;
};

export function normalizeOfficeCode(value: string) {
  return value.trim().toUpperCase();
}

export function normalizePhones(value: unknown) {
  const list = Array.isArray(value) ? value : [];
  return [
    ...new Set(
      list
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean),
    ),
  ];
}

export function toPublicOffice(office: Office): PublicOffice {
  return {
    id: office.uuid,
    company_uuid: office.company.uuid,
    company: toPublicCompany(office.company),
    office_code: normalizeOfficeCode(office.office_code),
    name: office.name,
    address: office.address,
    phones: office.phones ?? [],
    note: office.note,
    created_at: office.created_at,
    updated_at: office.updated_at,
  };
}
