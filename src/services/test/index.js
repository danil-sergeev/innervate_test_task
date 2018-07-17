import configApi from 'config';
import merge from 'lodash/merge';
import { missingService, oncePerServices, serviceName } from '../../common/services';

export const name = serviceName(__filename);

const schema = require('./index.schema');
const serviceConfig = configApi.get('externalTestService');

export default oncePerServices(function (services) {
  const {
    postgres = missingService('postgres')
  } = services;
  
  class TestService {
    
    _timerId = null;
    
    constructor(options) {
      schema.ctor_options(this, options);
      this._options = options;
    }
    
    async _serviceStart() {
      if (this._enabled && this._importEnabled) {
        this._timerId = setInterval(() => {
          return console.info(`test service is alive`);
        }, this._processInterval);
      }
      
    }
    
    async _serviceStop() {
      clearInterval(this._timerId);
    }
  }
  
  const mergedConfig = merge(serviceConfig, { dependsOn: [postgres] });
  return new (require('../../common/services').Service(services)(TestService))(name, mergedConfig);
});
