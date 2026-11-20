/**
 * Split one locked sentence into the two tones of a d2 headline, without changing a character.
 * `trailStartsWith` is where the second (muted) tone begins. Throws at build/render time if the
 * locked copy ever changes so that the split point no longer exists, so a copy edit can never
 * silently produce a half-styled or altered headline.
 */
export function splitCopy(text: string, trailStartsWith: string): [lead: string, trail: string] {
  const at = text.indexOf(trailStartsWith);
  if (at <= 0) throw new Error(`splitCopy: "${trailStartsWith}" not found in "${text}"`);
  const lead = text.slice(0, at).trimEnd();
  const trail = text.slice(at);
  if (`${lead} ${trail}` !== text) throw new Error(`splitCopy: split changes "${text}"`);
  return [lead, trail];
}
