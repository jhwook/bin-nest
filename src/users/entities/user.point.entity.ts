import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class UserPoint extends Model<UserPoint> {
  @Column
  userId: string;

  @Column
  entire_point: number;

  @Column
  to_pay_point: number;
}
