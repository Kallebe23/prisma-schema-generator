export enum FieldAttributeName {
  id = "@id",
  default = "@default",
  unique = "@unique",
  relation = "@relation",
  map = "@map",
  updatedAt = "@updatedAt",
  ignore = "@ignore",
}

export enum BlockAttributeName {
  id = "@@id",
  unique = "@@unique",
  index = "@@index",
  map = "@@map",
  ignore = "@@ignore",
  schema = "@@schema",
}

export enum ModelFieldScalarType {
  String = "String",
  Boolean = "Boolean",
  Int = "Int",
  BigInt = "BigInt",
  Float = "Float",
  Decimal = "Decimal",
  DateTime = "DateTime",
  Json = "Json",
  Bytes = "Bytes",
  Unsupported = "Unsupported",
}

export enum AttributeFunction {
  AUTO = "auto",
  AUTOINCREMENT = "autoincrement",
  SEQUENCE = "sequence",
  CUID = "cuid",
  UUID = "uuid",
  NANOID = "nanoid",
  NOW = "now",
  DBGENERATED = "dbgenerated",
}
