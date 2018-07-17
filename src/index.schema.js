import {VType, validateOptionsFactory} from './common/validation'

export const httpConfigSchema = validateOptionsFactory({
  protocol: {required: true, type: VType.String().notEmpty()},
  hostname: {required: true, type: VType.String().notEmpty()},
  port: {required: true, type: VType.Int().positive()},
  util: {type: VType.Object()}, //  системное свойство от npm config
});
