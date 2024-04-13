// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model, UUIDV4 } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const urls = sequelizeClient.define(
    'urls',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
      },
      fk_user: {
        type: DataTypes.UUID
      },
      date: {
        type: DataTypes.DATEONLY
      },
      title: {
        type: DataTypes.STRING
      },
      domain: {
        type: DataTypes.STRING
      },
      url: {
        type: DataTypes.TEXT
      },
      last_visit_time: {
        type: DataTypes.DATE
      },
      duration: {
        type: DataTypes.TIME
      },
      browser: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('Active', 'InActive'),
        defaultValue: 'Active',
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
      created_at_ip: {
        type: DataTypes.STRING,
      },
      updated_at_ip: {
        type: DataTypes.STRING,
      },
      deleted_at_ip: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'URLS',
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (urls as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    urls.belongsTo(models.users, { targetKey: 'id', foreignKey: 'fk_user'});
  };

  return urls;
}
