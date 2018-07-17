import moment from 'moment'
import 'moment-duration-format'
import missingService from './common/services/missingService'
import {VType, validateEventFactory, BaseEvent} from './common/events'
import oncePerServices from './common/services/oncePerServices'

export default oncePerServices(function defineEvents({bus = missingService('bus')}) {

  bus.registerEvent([
    {
      kind: 'event',
      type: 'node.state',
      validate: validateEventFactory({
        _extends: BaseEvent,
        state: {type: VType.String().notEmpty()},
      }),
      toString: (ev) => `${ev.service}: state: '${ev.state}'`,
    },
    {
      kind: 'event',
      type: 'webserver.started',
      validate: validateEventFactory({
        _extends: BaseEvent,
        config: {
          fields: {
            protocol: {required: true, type: VType.String().notEmpty()},
            hostname: {required: true, type: VType.String().notEmpty()},
            port: {required: true, type: VType.Int().positive()},
          }
        },
        urls: {
          type: VType.Array({
            fields: {
              path: {type: VType.String().notEmpty()},
              name: {type: VType.String().notEmpty()},
              purpose: {type: VType.String()},
            }
          })
        },
        startDuration: {type: VType.Int().positive()},
      }),
      toString: (ev) => {
        const info = [
          `${ev.service}: web service listening on port '${ev.config.port}'. ` +
          `started in ${moment.duration(ev.startDuration).format('h:mm:ss', 3)}${ev.failedServices ? `; failed: ${ev.failedServices.join(', ')}` : ``}`];
        if (ev.urls) {
          info.push(`  the following APIes are available:`);
          for (const v of ev.urls)
            info.push(`  ${v.path} : ${v.name}`);
        }
        return info.join('\n');
      }
    },

    {
      kind: 'method',
      type: 'graphql.method',
      validate: validateEventFactory({
        _extends: BaseEvent,
        method: {type: VType.String().notEmpty()},
        args: {type: VType.Object()},
        error: {type: VType.Object()},
        data: {type: VType.Object()},
        duration: {type: VType.Int()},
        failed: {type: VType.Int(), validate: v => v === 1 ? true : 'only 1(one) as value is allowed'},
        username: {type: VType.String()},
        email: {type: VType.String()},
      }),
      toString: ev => `${ev.service}: ${ev.method} ${ev.failed ? `failed` : `ok`} in ${ev.duration} ms'`,
    },

    {
      kind: 'error',
      type: 'graphql.error',
      validate: validateEventFactory({
        _extends: BaseEvent,
        method: {type: VType.String().notEmpty()},
        error: {fields: require('./common/errors/error.schema').eventErrorSchema},
      }),
      toString: (ev) => `graphql: '${ev.error.message}'`,
    },

  ]);
})
