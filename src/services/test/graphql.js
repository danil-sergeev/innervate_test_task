import {oncePerServices, missingService} from '../../common/services/index'

const PREFIX = '';

export default oncePerServices(function (services) {
  
  const graphqlBuilderSchema = require('../../common/graphql/LevelBuilder.schema');
  
  const resolvers = require('./resolvers').default(services);
  
  return async function builder(args) {
    
    graphqlBuilderSchema.build_options(args);
    const { parentLevelBuilder, typeDefs, builderContext } = args;
    
    typeDefs.push(`
      type ${PREFIX}TestQueryObject {
        a: String,
        b: String
      }
    
      type ${PREFIX}TestQueryElement {
        str: String,
        int: Int,
        obj: ${PREFIX}TestQueryObject
      }
      
    `);
    
    parentLevelBuilder.addQuery({
      name: `testQuery`,
      type: `[${PREFIX}TestQueryElement]`,
      args: `
        str_var: String,
        int_var: Int
      `,
      resolver: resolvers.testQuery(builderContext),
    });
    
  }
});
