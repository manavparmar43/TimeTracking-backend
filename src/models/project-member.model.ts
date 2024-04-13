// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model, UUIDV4 } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const projectMember = sequelizeClient.define(
    'project_member',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
      },
      fk_user: {
        type: DataTypes.UUID,
      },
      fk_project: {
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
      tableName: 'PROJECT_MEMBER',
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (projectMember as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    projectMember.belongsTo(models.users, { targetKey: 'id', foreignKey: 'fk_user'});
    projectMember.belongsTo(models.project, { targetKey: 'id', foreignKey: 'fk_project'});
  };

  return projectMember;
}
