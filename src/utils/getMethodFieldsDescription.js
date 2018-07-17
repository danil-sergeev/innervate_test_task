import throwIfMissing from 'throw-if-missing';

export default (gqlClass = throwIfMissing('gqlClass'), method = throwIfMissing('method')) => {
  const gqlFields = {};

  for (let field of method.result) {
    try {
      gqlClass._processResult({
        methodName: method.name,
        method: method,
        field,
        gqlFields
      });
    } catch (err) {
    }
  }

  return gqlFields;
};
