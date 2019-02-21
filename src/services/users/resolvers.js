import crypto from 'crypto';
import { oncePerServices, missingService } from '../../common/services/index';
import { GraphQLScalarType } from 'graphql';

export default oncePerServices((services) => {
	const { postgres = missingService('postgres') } = services;

	function allUsers(builderContext) {
		return async function(obj, args, context) {
			try {
				let statement = `SELECT * FROM public.users`;
				if (args) {
					statement = `SELECT * FROM public.users 
								WHERE  
									($1::boolean IS NULL OR manager = $1::boolean)
								AND 
									($2::boolean IS NULL OR blocked = $2::boolean)
								AND
									($3::text IS NULL OR position($3::text in name) > 0 )
								AND
									($4::text IS NULL OR position($4::text in login) > 0 )
								`;
				}
				// pg_trgm ?... в рамках этой задачи наверно слишком много)
				// SELECT id FROM TAG_TABLE WHERE 'aaaaaaaa' ~ tag_name; |или| SELECT id FROM TAG_TABLE WHERE strpos('aaaaaaaa', tag_name) > 0 для поиска в подстроке

				const res = await postgres.exec({
					statement,
					params: [ args.manager || null, args.blocked || null, args.name || null, args.login || null ]
				});
				return Promise.resolve(res.rows);
			} catch (error) {
				throw new Error(error);
			}
		};
	}

	function login(builderContext) {
		return async function(obj, args, context) {
			try {
				const { login, password } = args;

				const { rows } = await postgres.exec({
					statement: `SELECT * FROM public.users WHERE login = $1::text`,
					params: [ login ]
				});

				const { password_hash } = rows[0];
				const _hash = crypto.createHash('md5').update(password).digest('hex');
				const isMatch = password_hash === _hash;
				if (isMatch) {
					return Promise.resolve({
						ok: true,
						user: rows[0] // user obj
					});
				} else {
					return Promise.resolve({
						error: "Invalid password",
						ok: false
					});
				};
			} catch (error) {
				throw new Error(error);
			}
		};
	};
	
	return {
		allUsers,
		login
	};
});
