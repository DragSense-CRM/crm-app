import { FieldType } from "./field.enum";

export enum RelationType {
  ONE_TO_ONE = 'one-to-one',
  ONE_TO_MANY = 'one-to-many',
  MANY_TO_ONE = 'many-to-one',
  MANY_TO_MANY = 'many-to-many',
}



export enum ForeignKeyType {
  // 🟢 Highly Recommended Types (optimal performance)
  INT = FieldType.INT,          // PostgreSQL: INTEGER (4-byte)
  BIGINT = FieldType.BIGINT,    // PostgreSQL: BIGINT (8-byte)
  UUID = FieldType.UUID,        // PostgreSQL: UUID (16-byte)

  // 🟡 Situationally Recommended Types
  SMALLINT = FieldType.SMALLINT,// PostgreSQL: SMALLINT (2-byte) - for small ranges
  SERIAL = FieldType.SERIAL,    // PostgreSQL: SERIAL (auto-incrementing INT)
  BIGSERIAL = FieldType.BIGSERIAL, // PostgreSQL: BIGSERIAL (auto-incrementing BIGINT)

  
  // 🟡 Specialized Types (only when needed)
  INET = FieldType.INET,        // PostgreSQL: INET (IP addresses)
  MACADDR = FieldType.MACADDR,  // PostgreSQL: MACADDR (MAC addresses)
}