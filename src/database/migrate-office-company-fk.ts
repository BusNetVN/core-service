import { DataSource } from 'typeorm';

export async function migrateOfficeCompanyFk(dataSource: DataSource) {
  await dataSource.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'tbl_offices'
          AND column_name = 'company_uuid'
      ) THEN
        ALTER TABLE tbl_offices ADD COLUMN IF NOT EXISTS company_id BIGINT;

        UPDATE tbl_offices AS office
        SET company_id = company.id
        FROM tbl_companies AS company
        WHERE office.company_id IS NULL
          AND office.company_uuid = company.uuid;

        ALTER TABLE tbl_offices DROP CONSTRAINT IF EXISTS "uq_offices_company_code";
        ALTER TABLE tbl_offices DROP COLUMN company_uuid;
      END IF;
    END $$;
  `);
}
