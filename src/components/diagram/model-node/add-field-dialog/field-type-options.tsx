import { ModelFieldScalarType } from "@/types/schema-enums";
import { ReactNode } from "react";
import {
  Text,
  ToggleLeft,
  Hash,
  Server,
  Ruler,
  Percent,
  Calendar,
  Code,
  HardDrive,
  AlertCircle,
} from "lucide-react";

interface FieldType {
  value: ModelFieldScalarType;
  label: string;
  icon?: ReactNode;
}

export const fieldTypes: FieldType[] = [
  {
    value: ModelFieldScalarType.BigInt,
    label: ModelFieldScalarType.BigInt,
    icon: <Server />, // Ícone representando grandes volumes de dados
  },
  {
    value: ModelFieldScalarType.Boolean,
    label: ModelFieldScalarType.Boolean,
    icon: <ToggleLeft />, // Ícone de alternância (switch)
  },
  {
    value: ModelFieldScalarType.Bytes,
    label: ModelFieldScalarType.Bytes,
    icon: <HardDrive />, // Ícone representando armazenamento ou bytes
  },
  {
    value: ModelFieldScalarType.DateTime,
    label: ModelFieldScalarType.DateTime,
    icon: <Calendar />, // Ícone representando datas
  },
  {
    value: ModelFieldScalarType.Decimal,
    label: ModelFieldScalarType.Decimal,
    icon: <Percent />, // Ícone representando decimais (como porcentagens)
  },
  {
    value: ModelFieldScalarType.Float,
    label: ModelFieldScalarType.Float,
    icon: <Ruler />, // Ícone representando medidas contínuas
  },
  {
    value: ModelFieldScalarType.Int,
    label: ModelFieldScalarType.Int,
    icon: <Hash />, // Ícone representando números inteiros
  },
  {
    value: ModelFieldScalarType.Json,
    label: ModelFieldScalarType.Json,
    icon: <Code />, // Ícone representando estrutura de código (JSON)
  },
  {
    value: ModelFieldScalarType.String,
    label: ModelFieldScalarType.String,
    icon: <Text />, // Ícone representando texto
  },
  {
    value: ModelFieldScalarType.Unsupported,
    label: ModelFieldScalarType.Unsupported,
    icon: <AlertCircle />, // Ícone representando algo não suportado
  },
];
