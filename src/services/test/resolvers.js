import moment from 'moment';
import crypto from 'crypto';
import {oncePerServices, missingService} from '../../common/services/index';

function apolloToRelayResolverAdapter(oldResolver) {
  return function (obj, args, context) {
    return oldResolver(args, context.request);
  }
}

export default oncePerServices(function (services) {
    
    const {
        postgres = missingService('postgres')
    } = services;
  
  function testQuery(builderContext) {
    return async function(obj, args, context) {
      return [
          {str: "A", int: 1, obj: {a: "A1", b: "B1"}},
          {str: "B", int: 2, obj: {a: "A2", b: "B2"}},
          {str: "C", int: 3, obj: {a: "A3", b: "B3"}},
      ];
    }
  }

  return {
    testQuery,
  }
});
