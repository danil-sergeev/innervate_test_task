import { oncePerServices } from '../../common/services/index';

export default oncePerServices((services) => {
	// builder
	const graphqlBuilderSchema = require('../../common/graphql/LevelBuilder.schema');
	// resolvers
	const resolvers = require('./resolvers').default(services);
	return async function builder(args) {
		graphqlBuilderSchema.build_options(args);
		const { parentLevelBuilder, typeDefs, builderContext } = args;
		
		typeDefs.push(`
            type User {
                user_id: Int!
                login: String
                password_hash: String
                name: String
                email: String
                manager: Boolean
                blocked: Boolean
                data: JsonbDate
            }    
        `);

		typeDefs.push(`
			type AuthUser {
				ok: Boolean
				error: String
				user: User
			}
		`);

		parentLevelBuilder.setDescription('All GraphQL routes related to users.');
		parentLevelBuilder.addQuery({
			name: 'allUsers',
			description: 'Get list of all users.',
			type: `[User]`,
			args: `
                manager: Boolean,
                blocked: Boolean,
                name: String,
                login: String
            `,
			resolver: resolvers.allUsers(builderContext)
		});
		parentLevelBuilder.addMutation({
			name: 'login',
			description: 'Login user via GraphQL Route',
			type: 'AuthUser',
			args: `
                login: String
                password: String
            `,
			resolver: resolvers.login(builderContext)
		});
	};
});
