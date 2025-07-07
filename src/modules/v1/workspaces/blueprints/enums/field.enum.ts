export enum FieldType {
  // Numeric Types
  INT = 'int',                // PostgreSQL: INTEGER
  BIGINT = 'bigint',          // PostgreSQL: BIGINT
  SMALLINT = 'smallint',      // PostgreSQL: SMALLINT
  FLOAT = 'float',            // PostgreSQL: REAL (4-byte) or DOUBLE PRECISION (8-byte)
  DECIMAL = 'decimal',        // PostgreSQL: DECIMAL/NUMERIC (exact precision)
  SERIAL = 'serial',          // PostgreSQL: SERIAL (auto-incrementing integer)
  BIGSERIAL = 'bigserial',    // PostgreSQL: BIGSERIAL (auto-incrementing bigint)
  
  // Character Types
  STRING = 'string',          // PostgreSQL: VARCHAR or TEXT
  CHAR = 'char',              // PostgreSQL: CHAR (fixed-length)
  VARCHAR = 'varchar',        // PostgreSQL: VARCHAR (variable length with limit)
  TEXT = 'text',              // PostgreSQL: TEXT (unlimited length)
  
  // Date/Time Types
  DATE = 'date',              // PostgreSQL: DATE (date only)
  TIME = 'time',              // PostgreSQL: TIME (time only)
  TIMESTAMP = 'timestamp',    // PostgreSQL: TIMESTAMP (date + time)
  TIMESTAMPTZ = 'timestamptz',// PostgreSQL: TIMESTAMP WITH TIME ZONE
  INTERVAL = 'interval',      // PostgreSQL: INTERVAL
  
  // Boolean
  BOOLEAN = 'boolean',        // PostgreSQL: BOOLEAN
  
  // Network Address Types
  INET = 'inet',              // PostgreSQL: INET (IP address)
  CIDR = 'cidr',              // PostgreSQL: CIDR (network address)
  MACADDR = 'macaddr',        // PostgreSQL: MACADDR (MAC address)
  
  // JSON Types
  JSON = 'json',              // PostgreSQL: JSON
  JSONB = 'jsonb',            // PostgreSQL: JSONB (binary format)
  
  // Special Types
  UUID = 'uuid',              // PostgreSQL: UUID
  XML = 'xml',                // PostgreSQL: XML
  
  // Geometric Types
  POINT = 'point',            // PostgreSQL: POINT
  LINE = 'line',              // PostgreSQL: LINE
  LSEG = 'lseg',              // PostgreSQL: LSEG (line segment)
  BOX = 'box',                // PostgreSQL: BOX
  PATH = 'path',              // PostgreSQL: PATH
  POLYGON = 'polygon',        // PostgreSQL: POLYGON
  CIRCLE = 'circle',          // PostgreSQL: CIRCLE
  
  // Binary Data
  BYTEA = 'bytea',            // PostgreSQL: BYTEA (binary data)
  
  // Range Types
  INT4RANGE = 'int4range',    // PostgreSQL: INT4RANGE
  INT8RANGE = 'int8range',    // PostgreSQL: INT8RANGE
  NUMRANGE = 'numrange',      // PostgreSQL: NUMRANGE
  TSRANGE = 'tsrange',        // PostgreSQL: TSRANGE
  TSTZRANGE = 'tstzrange',    // PostgreSQL: TSTZRANGE
  DATERANGE = 'daterange',    // PostgreSQL: DATERANGE
  
  // Your original complex types
  OBJECT = 'object',          // Typically mapped to JSON/JSONB
  ARRAY = 'array',            // PostgreSQL: Array of any type (e.g., INTEGER[])
  ENUM = 'enum',              // PostgreSQL: ENUM (custom enumerated type)
  
  // Money
  MONEY = 'money',            // PostgreSQL: MONEY
  
  // Bit Strings
  BIT = 'bit',                // PostgreSQL: BIT (fixed length)
  VARBIT = 'varbit',          // PostgreSQL: VARBIT (variable length)
  
  // Text Search
  TSVECTOR = 'tsvector',      // PostgreSQL: TSVECTOR
  TSQUERY = 'tsquery',        // PostgreSQL: TSQUERY
  
  // Composite
  COMPOSITE = 'composite',    // PostgreSQL: COMPOSITE (custom type)
  
  // Domain
  DOMAIN = 'domain',          // PostgreSQL: DOMAIN (custom constrained type)
}