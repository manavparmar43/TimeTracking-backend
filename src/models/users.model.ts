// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model, UUIDV4 } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const users = sequelizeClient.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'member'),
      },
      first_name: {
        type: DataTypes.STRING,
        set: function (val: string) {
          val = val.trim();
          this.setDataValue('first_name', val);
        },
      },
      middle_name: {
        type: DataTypes.STRING,
        set: function (val: string) {
          val = val.trim();
          this.setDataValue('middle_name', val);
        },
      },
      last_name: {
        type: DataTypes.STRING,
        set: function (val: string) {
          val = val.trim();
          this.setDataValue('last_name', val);
        },
      },
      job: {
        type: DataTypes.UUID,
      },
      technology: {
        type: DataTypes.UUID,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'email',
          msg: 'Email already in use',
        },
        validate: {
          isEmail: { msg: 'You must enter a valid email' },
        },
        set: function (val: string) {
          val = val.toLowerCase().trim();
          this.setDataValue('email', val);
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      google_id: {
        type: DataTypes.STRING,
      },
      reset_password_link: {
        type: DataTypes.JSON,
      },
      login_retry_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      login_reactive_time: {
        type: DataTypes.DATE,
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
      tableName: 'USER',
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (users as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    users.belongsTo(models.lookup, {
      targetKey: 'id',
      foreignKey: 'job',
    });
    users.belongsTo(models.lookup, {
      targetKey: 'id',
      foreignKey: 'technology',
    });
    users.hasMany(models.project, {
      sourceKey: 'id',
      foreignKey: 'created_by',
    });
    users.hasMany(models.project_member, {
      sourceKey: 'id',
      foreignKey: 'fk_user',
    });
    users.hasMany(models.todo, { sourceKey: 'id', foreignKey: 'fk_user' });
    users.hasMany(models.activity_log, {
      sourceKey: 'id',
      foreignKey: 'fk_user',
    });
    users.hasMany(models.urls, {
      sourceKey: 'id',
      foreignKey: 'fk_user',
    });
  };

  return users;
}
