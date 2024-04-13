// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model, UUIDV4 } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const project = sequelizeClient.define(
    'project',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      is_internal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      fk_client: {
        type: DataTypes.UUID,
      },
      estimated_hours: {
        type: DataTypes.DECIMAL
      },
      created_by: {
        type: DataTypes.UUID,
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
      tableName: 'PROJECT',
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (project as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    project.belongsTo(models.users, { targetKey: 'id', foreignKey: 'created_by'});
    project.belongsTo(models.client, { targetKey: 'id', foreignKey: 'fk_client'});
    project.hasMany(models.project_member, { sourceKey: 'id', foreignKey: 'fk_project' });
    project.hasMany(models.todo, { sourceKey: 'id', foreignKey: 'fk_project' });
    project.hasMany(models.activity_log, { sourceKey: 'id', foreignKey: 'fk_project' });
  };

  return project;
}
