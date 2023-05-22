import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  PrimaryKey,
} from "sequelize-typescript";
import User from "./User";
import { DataTypes } from "sequelize";

export default class Session {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: DataTypes.UUIDV4 })
  id!: string;

  @ForeignKey(() => User)
  @Column
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.STRING(300))
  userAgent!: string;
}
