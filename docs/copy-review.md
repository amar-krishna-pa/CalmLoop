# User-facing copy review

Reviewed 15 September 2026 using the requested calm, plain-language tone.

## Scope

Searched application routes, components, loading and accessibility labels, toast
notifications, API error strings, validation schemas, static content, metadata,
and prompts that generate text. Retained clear labels such as Save, Cancel,
Send, Loading and neutral search states. Internal diagnostic logs, database names,
theme enum values and user-authored content are not product copy and were preserved.

## Flagged patterns and applied rewrites

| Area | Previous copy or issue | Applied direction / example |
| --- | --- | --- |
| Authentication and profile | “Failed to sign in”, “Failed to update name” | “We couldn’t update your name. You can try again.” |
| Passkeys | Unexplained term and abrupt errors | Explain fingerprint, face or device PIN; use the same calm error pattern. |
| Prepare | “Nothing to add from that one.” | State that the app could not identify a fear; offer adding context or leaving the entry. Use an informational notification. |
| Entry preview | “Only save what feels accurate.” | “A brief description is enough. You can edit saved fears later.” |
| Saved fears | Multi-step empty-state instructions | One entry is enough; describe where saved entries appear. |
| Past entries | “Occurrences”, “No occurrences found.” | “Past entries”; explain what will appear. Align dialog and loading labels. |
| Exposures | “Your exposure list is empty.” | “No practice situations yet”; name Prepare in bold and explain how saved entries reach this list. |
| Navigation | “Use in Practice” implied transferring an entry | “View Exposures”; the existing link only opens that tab. |
| Shared editors | Unexplained safety behaviours and themes | Explain both inline. State that themes are optional and behaviours can be left blank. |
| Saving errors | Repeated requests to confirm or retry saving | State uncertainty once and mention the retained draft where the form actually keeps it. |
| API errors | “Unauthorized”, “Invalid request”, “Extraction failed” | Plain sign-in, request and processing messages. Preserve response status codes and ownership behavior. |
| Today | “adherence”, “Missed”, achievement-oriented streak labels | “recorded as taken”, “Not taken”, “Consecutive active days”. |
| Daily reflections | Dramatic, prescriptive and outcome-promising attributed quotes | Original short reflections without quotation marks or false attribution. |
| Maintain | “creeping back in”, task quotas, compulsory plans | “Noticing more checking”, short practice options, “What I can try”. |
| Learn | “why compulsions make it worse”, “the threat was never real” | Describe the loop without blame or proving safety; explain ERP in everyday language. |
| Reflect | “OCD Subtypes”, unexplained “Pure O” | “OCD themes”, “Mental rituals”. |
| Landing | “Break the loop”, “locking in long-term resilience” | Invite exploration at the user's pace without promising outcomes. |
| Landing feature list | Unimplemented tools presented as available | Describe saved situations, entries and ratings; identify planning examples. |
| Privacy and availability | “100%”, “never shared”, “Fully encrypted & secure”, “24/7” app promises | Describe actual storage and Groq processing; remove unsupported guarantees. |
| Chat demo and prompt | Trust-memory reassurance, fixed-time challenges, guaranteed relief | Brief acknowledgement and a small optional step without resolving the feared uncertainty. |
| Crisis copy | Pressured heading and outdated contact details | “Crisis support in India”; keep emergency instructions direct and update provider details. |
| Metadata | Create Next App defaults | CalmLoop title and a plain description. |

## Existing functional gaps found during the review

These need implementation work beyond a text rewrite:

- Chat history loads can fall back to a new-chat state after a request failure.
  Some chat sidebar actions and streamed failures have no visible error state.
  Suggested message: “We couldn’t load your chats. You can try again.”
- Several Today, Reflect, Support and Maintain cards use sample data or controls
  without persistence. Copy identifies examples where applicable; it cannot make
  these tools save data. The past-entry save button is also disabled.
- Terms, privacy and contact links include placeholder destinations. The copy
  makes no claim that a complete policy or support workflow exists.
- API validation details retain technical field-level diagnostics. Clients should
  display the friendly top-level error or a specific field message, not raw Zod output.
- Model prompts now follow the standard, but live model behavior still needs
  evaluation, including repeated reassurance requests and crisis conversations.

## Sources for factual corrections

- [NIMH: OCD and ERP](https://www.nimh.nih.gov/health/publications/obsessive-compulsive-disorder-when-unwanted-thoughts-or-repetitive-behaviors-take-over)
- [Government of India: Tele-MANAS](https://www.mohfw.gov.in/tele-manas)
- [Parliament response: KIRAN merged and phased out](https://sansad.in/getFile/annex/266/AU2517_IEkJZF.pdf?source=pqars)
- [Vandrevala Foundation contact details](https://www.vandrevalafoundation.com/free-counseling/contact-us)
- [iCALL contact details and hours](https://icallhelpline.org/)

The code review verifies wording and its relationship to current behavior. It does
not verify rendered layout on every screen or responses from a live AI model.

## Checks

- TypeScript (`pnpm exec tsc --noEmit`) passed.
- ESLint passed for all changed TypeScript files.
- `git diff --check` passed.
- Full-project lint reports the pre-existing state-update-in-effect error in
  `app/components/common/header/Header.tsx`.
