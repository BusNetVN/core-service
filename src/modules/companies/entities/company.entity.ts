import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BusinessType } from '../enums/business-type.enum.js';

@Entity('tbl_companies')
export class Company {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Index({ unique: true })
  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 120, default: '' })
  short_name: string;

  @Column({
    length: 32,
    unique: true,
    transformer: {
      to: (value: unknown) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
      from: (value: unknown) =>
        typeof value === 'string' ? value.toLowerCase() : value,
    },
  })
  company_code: string;

  @Column({ length: 180, unique: true })
  slug: string;

  @Column({ default: '' })
  logo_url: string;

  @Column({ default: '' })
  cover_image_url: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({
    type: 'enum',
    enum: BusinessType,
    enumName: 'company_business_type',
  })
  business_type: BusinessType;

  @Column({ length: 32, default: '' })
  tax_code: string;

  @Column({ length: 64, default: '' })
  business_license_no: string;

  @Column({ length: 120, default: '' })
  legal_representative: string;

  @Column({ length: 32, default: '' })
  representative_phone: string;

  @Column({ length: 180, default: '' })
  email: string;

  @Column({ length: 32, default: '' })
  phone: string;

  @Column({ default: '' })
  website: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
