import {oncePerServices} from './common/services'
import {makeExecutableSchema} from 'graphql-tools'
import {SchemaBuilder, LevelBuilder} from './common/graphql'

const hasOwnProperty = Object.prototype.hasOwnProperty;

import {missingArgument, invalidArgument} from './common/utils/arguments'

export default oncePerServices(function (services = missingArgument('services')) {

  return async function() {

    const typeDefs = [];
    const resolvers = Object.create(null);

    await (new SchemaBuilder({
      test: require('./services/test/graphql').default(services)
      
    }).build({typeDefs, resolvers}));

    return makeExecutableSchema({
      typeDefs,
      resolvers
    })
  }
});

