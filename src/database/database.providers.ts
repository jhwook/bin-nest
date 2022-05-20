import { UserPoint } from './../users/entities/user.point.entity';
import { User } from '../users/entities/user.entity';
import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'aaa',
        sync: { force: true },
      });
      sequelize.addModels([User, UserPoint]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
