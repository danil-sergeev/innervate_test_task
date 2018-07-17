import path from 'path'
import url from 'url'
import http from 'http'
import 'moment-duration-format'
import prettyError from './common/utils/prettyError'
import configAPI from 'config'
import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {missingExport} from './common/services'
import errorDataToEvent from './common/errors/errorDataToEvent'
const schema = require('./index.schema');
const realConsole = console;

(async function () {

  let manager, nodeName, bus;

  try {

    const httpConfig = configAPI.get('http');
    schema.httpConfigSchema(httpConfig, {argument: 'config.http'});
    //
    const timeOfProcessStart = new Date().getTime();

    nodeName = configAPI.get('node');

    const consoleAndBusServicesOnly = Object.create(null);
    consoleAndBusServicesOnly.console = console;
    bus = consoleAndBusServicesOnly.bus = new (require('./common/events').Bus(consoleAndBusServicesOnly))({nodeName: nodeName});

    const eventLoader = require('./common/services/defineEvents').default(consoleAndBusServicesOnly );
    await eventLoader(path.join(process.cwd(), 'src'));

    bus.event({type: 'node.state', service: nodeName, state: 'starting'});

    manager = new (require('./common/services').NodeManager(consoleAndBusServicesOnly))({ // далее consoleAndBusServicesOnly нельзя.  нужно пользоваться manager.services
      name: nodeName,
      services: [
        require('./services/postgres')
      ]
    });

    // ждем пока NodeManager скажет что он готов.  при этом часть сервисов может быть в состоянии failed
    await manager.started;
    
    let expressApp = express();

    expressApp.use(cors());
    
    let graphqlRouterV2 = express.Router();
    const graphqlSchemaV2 = await (require('./graphqlSchemaV2').default(manager.services)());
    graphqlRouterV2.post('/graphql/v2', bodyParser.json(), graphqlExpress(request => ({
      schema: graphqlSchemaV2,
      context: {request, user: request.user},
    })));
    graphqlRouterV2.get('/graphql/v2', graphiqlExpress({endpointURL: '/graphql/v2'}));
    expressApp.use('/', graphqlRouterV2);
    
    // Запускаем сервер
    let httpServer = http.Server(expressApp);
    await new Promise(function (resolve, reject) {
      httpServer.listen(httpConfig.port, function (err, data) {
        if (err) reject(err);
        else resolve(data);
      })
    });
    
    bus.event({
        type: 'webserver.started',
        service: nodeName,
        startDuration: new Date().getTime() - timeOfProcessStart,
        config: {...httpConfig},
        urls: [
            {path: '/graphql/v2', name: 'graphql user interface (Ver 2)',},
        ]
    });

  } catch (error) {
    console.error(prettyError(error).stack);
    if (manager) await manager.dispose();
  }

})();
