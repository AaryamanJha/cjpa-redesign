import { Contact } from "@/types/portal"

const STOPWORDS = new Set([
  "a", "an", "the", "i", "im", "me", "my", "to", "for", "of", "in", "on", "at", "and", "or",
  "want", "need", "looking", "find", "get", "some", "few", "who", "can", "please", "help",
  "reach", "out", "contact", "contacts", "person", "people", "someone", "with", "about",
  "raise", "raising", "is", "are", "be", "this", "that", "hey", "ai", "you", "your",
])

function keywords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
}

/**
 * Narrows a (potentially huge) contact list down to a token-budget-friendly
 * candidate set before it's handed to the LLM, by scoring company/title/name
 * matches against keywords extracted from the user's query. Falls back to a
 * recency-ordered sample if nothing scores, so the model still has something
 * to reason over instead of an empty list.
 */
export function pickRelevantContacts(contacts: Contact[], query: string, limit = 80): Contact[] {
  // Small lists fit comfortably in the model's context on their own — let the
  // LLM reason over the full list rather than risk a keyword miss dropping a
  // genuinely relevant contact (e.g. a "Managing Director" for a capital-raise
  // query, whose title/company don't literally contain "capital").
  if (contacts.length <= limit) return contacts

  const terms = keywords(query)
  if (terms.length === 0) return contacts.slice(-limit)

  const scored = contacts
    .map((c) => {
      const haystack = `${c.company ?? ""} ${c.title ?? ""} ${c.name ?? ""}`.toLowerCase()
      const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0)
      return { contact: c, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) return contacts.slice(-limit)
  return scored.slice(0, limit).map((s) => s.contact)
}
