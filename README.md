# @lp-labs/accept-header-negotiator

Accept media-range parser and deterministic best-supported media type selection.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/accept-header-negotiator
```

## Working example

```js
import { negotiateAccept } from '@lp-labs/accept-header-negotiator';
const selected = negotiateAccept('text/*;q=0.8, application/json;q=1', [
  'text/html',
  'application/json',
]);
if (selected !== 'application/json') throw new Error('Unexpected negotiated type');
```

CommonJS: `const api = require('@lp-labs/accept-header-negotiator')`.

## Behavior, customization and limits

Parses type/subtype ranges and q values, then chooses the supported type with the highest matching quality, specificity, and header-order preference. Other parameters are ignored; server content negotiation and charset/language semantics are out of scope.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export declare function negotiateAccept(
  header: string,
  supported: readonly string[],
): string | null;
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
