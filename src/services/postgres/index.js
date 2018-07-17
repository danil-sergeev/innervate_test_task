import configAPI from 'config'
import oncePerServices from '../../common/services/oncePerServices'

export const name = require('../../common/services/serviceName').default(__filename);

export default oncePerServices(function (services) {

  const PGConnector = require('../../common/connectors/PGConnector').default(services);

  return new (require('../../common/services').Service(services)(PGConnector))(name, configAPI.get('postgres'));
});
