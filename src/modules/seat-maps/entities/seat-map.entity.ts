import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity.js';
import { SeatMapType } from '../enums/seat-map-type.enum.js';

export type SeatMapCellType = 'seat' | 'empty';

export type SeatMapCell = {
  floor: number;
  row: number;
  col: number;
  code: string;
  type: SeatMapCellType;
};

@Entity('tbl_seat_maps')
@Index('uq_seat_maps_company_code', ['company_id', 'seat_map_code'], {
  unique: true,
})
export class SeatMap {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Index({ unique: true })
  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Index()
  @Column({ type: 'bigint' })
  company_id: string;

  @ManyToOne(() => Company, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_seat_maps_company',
  })
  company: Company;

  @Column({
    length: 32,
    transformer: {
      to: (value: unknown) =>
        typeof value === 'string' ? value.trim().toUpperCase() : value,
      from: (value: unknown) =>
        typeof value === 'string' ? value.toUpperCase() : value,
    },
  })
  seat_map_code: string;

  @Column({ length: 180 })
  name: string;

  @Column({
    type: 'varchar',
    length: 32,
    default: SeatMapType.Seat,
  })
  layout_type: SeatMapType;

  @Column({ type: 'int', default: 1 })
  floors: number;

  @Column({ type: 'int', default: 10 })
  rows: number;

  @Column({ type: 'int', default: 4 })
  columns: number;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  seats: SeatMapCell[];

  @Column({ type: 'text', default: '' })
  note: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
