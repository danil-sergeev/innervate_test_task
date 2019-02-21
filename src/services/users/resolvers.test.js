import config from 'config';
import axios from 'axios';
import test from 'ava';

const { protocol, hostname, port } = config.get('http');
const { pathname } = config.get('graphql');

const graphQLUrl = `${protocol}://${hostname}:${port}${pathname}/v2`;

// allUsers()
test('query for an all users', async (t) => {
	const response = await axios.post(graphQLUrl, {
		query: `
            query {
                users {
                    allUsers {
                    name
                    }
                }
            }
        `
	});
	const {data} = response;
	console.log(data);

	t.deepEqual(data, {
		"data": {
		  "users": {
			"allUsers": [
			  {
				"name": "Пользователь системы"
			  },
			  {
				"name": "Менеджер системы"
			  },
			  {
				"name": "Администратор системы"
			  },
			  {
				"name": "Заблокированный пользователь"
			  },
			  {
				"name": "Заблокированный менеджер системы"
			  },
			  {
				"name": "Пользователь системы 2"
			  }
			]
		  }
		}
	  });
});

test('test of manager boolean input with data', async (t) => {
	const { data } = await axios.post(graphQLUrl, {
		query: `
            query {
                users {
                    allUsers(manager: true) {
                        name
                        data
                    }
                }
            }
        `
	});
	t.deepEqual(data, {
		data: {
			users: {
				allUsers: [
					{
						name: 'Менеджер системы',
						data: null
					},
					{
						name: 'Администратор системы',
						data: '2018-07-17T02:54:57.943Z'
					},
					{
						name: 'Заблокированный менеджер системы',
						data: null
					}
				]
			}
		}
	});
});

test('test of blocked boolean input', async (t) => {
	const response = await axios.post(graphQLUrl, {
		query: `
            query {
                users {
                    allUsers(blocked: true) {
                        name
                        blocked
                    }
                }
            }
        `
	});
	const {data} = response;
	t.deepEqual(data, {
		data: {
			users: {
				allUsers: [
					{
						name: 'Заблокированный пользователь',
						blocked: true
					}
				]
			}
		}
	});
});

test('test of substring search and with manager boolean aswell', async (t) => {
	const response = await axios.post(graphQLUrl, {
		query: `
            query {
                users {
                    allUsers(manager: true, name: "локир") {
                        name
                        manager
                    }
                }
            }
        `
	});
	const {data} = response;
	t.deepEqual(data, {
		data: {
			users: {
				allUsers: [
					{
						name: 'Заблокированный менеджер системы',
						manager: true
					}
				]
			}
		}
	});
});

// login()
test('simple test of auth mutation', async (t) => {
	const response = await axios.post(graphQLUrl, {
		query: `
            mutation {
                users {
                    login(login:"admin", password:"12345") {
                        ok
                        user {
                            user_id
                            name
                        }
                        error
                    }
                }
          }
        `
	});
	const {data} = response;
	t.deepEqual(data, {
		data: {
			users: {
				login: {
					ok: true,
					user: {
						user_id: 1,
						name: 'Администратор системы'
					},
					error: null
				}
			}
		}
	});
});

test('invalid credentials in login mutation', async (t) => {
	const { data } = await axios.post(graphQLUrl, {
		query: `
            mutation {
                users {
                    login(login:"admin", password:"123345") {
                        ok
                        error
                    }
                }
            }
        `
	});
	t.deepEqual(data, {
		"data": {
		  "users": {
			"login": {
			  "ok": false,
			  "error": "Invalid password"
			}
		  }
		}
	  });
});
