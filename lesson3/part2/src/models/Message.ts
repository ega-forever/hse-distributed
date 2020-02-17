import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export default class Message extends Model<Message> {

  @Column
  public message: string;

  @Column({ type: DataTypes.DATE })
  public date: Date;
}