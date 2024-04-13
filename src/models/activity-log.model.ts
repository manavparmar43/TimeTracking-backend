// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model, UUIDV4 } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const activityLog = sequelizeClient.define(
    'activity_log',
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
      fk_project: {
        type: DataTypes.UUID
      },
      fk_todo: {
        type: DataTypes.UUID
      },
      date: {
        type: DataTypes.DATEONLY
      },
      start_time: {
        type: DataTypes.TIME
      },
      end_time: {
        type: DataTypes.TIME
      },
      duration: {
        type: DataTypes.TIME
      },
      idle_time: {
        type: DataTypes.TIME
      },
      screen_activity: {
        type: DataTypes.ARRAY(DataTypes.JSONB)
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
      tableName: 'ACTIVITY_LOG',
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (activityLog as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    activityLog.belongsTo(models.users, { targetKey: 'id', foreignKey: 'fk_user'});
    activityLog.belongsTo(models.project, { targetKey: 'id', foreignKey: 'fk_project' });
    activityLog.belongsTo(models.todo, { targetKey: 'id', foreignKey: 'fk_todo' });
    activityLog.hasMany(models.screenshot, { sourceKey: 'id', foreignKey: 'fk_activity_log' });
  };

  return activityLog;
}
