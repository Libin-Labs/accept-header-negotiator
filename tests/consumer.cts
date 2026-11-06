import * as api from '@lp-labs/accept-header-negotiator';
import { negotiateAccept } from '@lp-labs/accept-header-negotiator';
const selected = negotiateAccept('text/*;q=0.8, application/json;q=1', [
  'text/html',
  'application/json',
]);
if (selected !== 'application/json') throw new Error('Unexpected negotiated type');
// @ts-expect-error invalid argument must be rejected by declarations
api.negotiateAccept('text/html', [4]);
