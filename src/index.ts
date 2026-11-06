interface Range {
  type: string;
  subtype: string;
  q: number;
  order: number;
}
function parse(text: string): Range[] {
  if (typeof text !== 'string' || text.length > 8192)
    throw new TypeError('Expected bounded Accept header');
  if (!text.trim()) return [{ type: '*', subtype: '*', q: 1, order: 0 }];
  return text.split(',').map((part, order) => {
    const [raw, ...params] = part.trim().split(';'),
      m = /^\s*([\w!#$&^_.+-]+|\*)\/([\w!#$&^_.+-]+|\*)\s*$/.exec(raw!);
    if (!m) throw new TypeError('Malformed media range');
    let q = 1;
    for (const p of params) {
      const qv = /^\s*q\s*=\s*(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)\s*$/i.exec(p);
      if (/^\s*q\s*=/i.test(p)) {
        if (!qv) throw new TypeError('Invalid q value');
        q = Number(qv[1]);
      }
    }
    return { type: m[1]!.toLowerCase(), subtype: m[2]!.toLowerCase(), q, order };
  });
}
export function negotiateAccept(header: string, supported: readonly string[]): string | null {
  if (!Array.isArray(supported) || supported.length > 4096)
    throw new RangeError('Supported-type list exceeds budget');
  const ranges = parse(header);
  let best: { type: string; q: number; spec: number; order: number; index: number } | null = null;
  for (let index = 0; index < supported.length; index++) {
    const value = supported[index]!;
    const m = /^([\w!#$&^_.+-]+)\/([\w!#$&^_.+-]+)$/.exec(value);
    if (!m) throw new TypeError('Invalid supported media type');
    const type = m[1]!.toLowerCase(),
      sub = m[2]!.toLowerCase();
    const matches = ranges
      .filter(
        (r) => (r.type === '*' || r.type === type) && (r.subtype === '*' || r.subtype === sub),
      )
      .sort(
        (a, b) =>
          (b.type !== '*' ? 1 : 0) +
            (b.subtype !== '*' ? 1 : 0) -
            ((a.type !== '*' ? 1 : 0) + (a.subtype !== '*' ? 1 : 0)) || a.order - b.order,
      );
    const r = matches[0];
    if (!r || r.q === 0) continue;
    const spec = (r.type === '*' ? 0 : 1) + (r.subtype === '*' ? 0 : 1);
    if (
      !best ||
      r.q > best.q ||
      (r.q === best.q && spec > best.spec) ||
      (r.q === best.q && spec === best.spec && r.order < best.order) ||
      (r.q === best.q && spec === best.spec && r.order === best.order && index < best.index)
    )
      best = { type: value, q: r.q, spec, order: r.order, index };
  }
  return best?.type ?? null;
}
