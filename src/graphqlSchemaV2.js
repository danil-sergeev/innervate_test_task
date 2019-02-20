import { oncePerServices } from './common/services';
import { makeExecutableSchema } from 'graphql-tools';
import { SchemaBuilder, LevelBuilder } from './common/graphql';

const hasOwnProperty = Object.prototype.hasOwnProperty;

import { missingArgument, invalidArgument } from './common/utils/arguments';

export default oncePerServices(function(services = missingArgument('services')) {
	return async function() {
		const typeDefs = [];
		const resolvers = Object.create(null);

		// не смог почему - то добавить в графкл-билдере сервиса, потому вот тут добавил :)
		typeDefs.push(`
      		scalar JsonbDate
    	`);

		resolvers.JsonbDate = new GraphQLScalarType({
			name: 'JsonbDate',
			// idk why but description can't be seen in the GraphiQL GUI
			description: 'JsonbDate from PostgreSQL for GraphQL',
			parseValue(value) {
				return value;
			},
			serialize(value) {
				const { birthday } = value;
				return new Date(birthday);
			},
			parseLiteral(ast) {
				if (ast.kind === Kind.INT) {
					return new Date(ast.value);
				}
				return null;
			}
		});

		await new SchemaBuilder({
			users: require('./services/users/graphql').default(services)
		}).build({ typeDefs, resolvers });

		return makeExecutableSchema({
			typeDefs,
			resolvers
		});
	};
});
