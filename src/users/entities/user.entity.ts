import { Table, Column, Model, Default } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column
  email: string;

  @Column
  password: string;

  @Column
  code: string;

  @Column
  // @Default()
  oauth: boolean;

  @Column
  oauth_id: string;
}
