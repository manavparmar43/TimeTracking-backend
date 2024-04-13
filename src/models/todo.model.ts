// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model, UUIDV4 } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const todo = sequelizeClient.define(
    'todo',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING
      },
      fk_project: {
        type: DataTypes.UUID
      },
      fk_user: {
        type: DataTypes.UUID
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
      tableName: 'TODO',
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (todo as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    todo.belongsTo(models.users, { targetKey: 'id', foreignKey: 'fk_user'});
    todo.belongsTo(models.project, { targetKey: 'id', foreignKey: 'fk_project' });
    todo.hasMany(models.activity_log, { sourceKey: 'id', foreignKey: 'fk_todo' });
  };

  return todo;
}
