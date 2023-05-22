import { DataTypes, Optional } from "sequelize";
import {
  Column,
  DataType,
  IsUUID,
  PrimaryKey,
  Table,
  Model,
} from "sequelize-typescript";

export interface DeveloperAttributes {
  id: string;
  fullname: string;
  company: string;
  role: string;
  email: string;
  password: string;
}

export interface DeveloperCreationAttributes
  extends Optional<DeveloperAttributes, "id"> {}

@Table
export default class Developer extends Model<
  DeveloperAttributes,
  DeveloperCreationAttributes
> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: DataTypes.UUIDV4 })
  id!: string;

  @Column({ type: DataType.STRING(60) })
  fullname!: string;

  @Column({ type: DataType.STRING(250) })
  company!: string;

  @Column({ type: DataType.STRING(150) })
  role!: string;

  @Column({ type: DataType.STRING(60) })
  email!: string;

  @Column({ type: DataType.CHAR(60) })
  password!: string;
}
