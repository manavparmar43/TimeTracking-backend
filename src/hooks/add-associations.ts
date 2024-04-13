
import { HookContext } from '@feathersjs/feathers';
import { Order, Association } from 'sequelize';
import Debug from 'debug';
const debug = Debug('feathers:app:SubAssociations');

interface SubAssociations {
  models?: SubModelAssociations[];
  attributes?: any;
  order?: Order;
  limit?: number | boolean;
  offset?: number;
  separate?: boolean;
  association?: Association | string;
}

interface SubModelAssociations {
  model: string;
  as?: string;
  attributes?: any;
  subModels?: SubModelAssociations[];
  include?: any;
  where?: any;
  required?: boolean;
  order?: Order;
  limit?: number | boolean;
  offset?: number;
  separate?: boolean;
  association?: Association | string;
}

export default (associations: SubAssociations = {}) => {
  associations.models = associations.models || [];

  return async (context: HookContext) => {
    const sequelize = context.params.sequelize || {};
    const include = sequelize.include || [];
    
    sequelize.attributes = associations.attributes;
    if (associations.order) {
      sequelize.order = associations.order;
    }
    sequelize.include = include.concat(
      associations.models?.map((model) => {
        const newModel = { ...model };
        newModel.model = context.app.services[model.model].Model;
        const models = newModel.subModels || [] ;
        if (models.length > 0) {
          subModelObject(newModel, context);
        }
        return newModel;
      }),
    );

    //  Nested output
    sequelize.raw = false;
    context.params.sequelize = sequelize;
    return context;
  };
};

const subModelObject = async (newModel: SubModelAssociations, context: HookContext) => {
  const models = newModel.subModels || [] ;
  const inlcude: any[] = [];
  newModel.include = inlcude.concat(
    models.map((submodel) => {
      const newSubModel = { ...submodel };
      newSubModel.model = context.app.services[submodel.model].Model;
      const subModels = newModel.subModels || [] ;
      if (subModels.length > 0) {
        subModelObject(newSubModel, context);
      }
      return newSubModel;
    })
  );
};
