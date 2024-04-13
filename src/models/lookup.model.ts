// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model, UUIDV4 } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const lookup = sequelizeClient.define(
    'lookup',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
      },
      key: {
        type: DataTypes.STRING,
        set: function (val: string) {
          val = val.toLocaleLowerCase();
          val = val.replace(/\s+/g, '_');
          this.setDataValue('key', val);
        },
      },
      value: {
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
      tableName: 'LOOKUP',
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (lookup as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    lookup.hasMany(models.users, { sourceKey: 'id', foreignKey: 'job' });
    lookup.hasMany(models.users, { sourceKey: 'id', foreignKey: 'technology' });
  };

  return lookup;
}
