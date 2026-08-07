/**
 * Take the JSON out of a markdown code fence, if the paste arrived in one.
 *
 * Every prompt in the app ends with "Output ONLY the JSON object" and asks for
 * no fences. Assistants wrap it anyway, often enough that the first thing a
 * writer sees on their first attempt is "That isn't valid JSON" about JSON that
 * is perfectly valid — it just has three backticks round it. Stripping them is
 * cheaper than teaching every user to.
 *
 * Lives on its own rather than in `sectionImport` so the pure parsers can reach
 * it without pulling in the database and the operation journal.
 *
 * Deliberately narrow: only a fence that opens the text and closes it. Anything
 * else is left alone so a genuine syntax error still reports as one.
 */
export function stripCodeFence(text: string): string {
  const trimmed = text.trim()
  if (!trimmed.startsWith('```')) return text
  const withoutOpen = trimmed.replace(/^```[^\n]*\n?/, '')
  return withoutOpen.replace(/\n?```$/, '')
}
