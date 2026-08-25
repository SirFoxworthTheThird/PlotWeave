import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label, labelClass } from './label'

/**
 * A labelled form control, associated automatically.
 *
 * N10, from a blind writer run: the app's most-used editing form — Character →
 * Current State — was measured live in the DOM and every control in it had
 * `id: null`, `aria-label: null`, `aria-labelledby: null`, and no wrapping
 * `<label>`. A screen reader announced the location picker as an unnamed
 * collapsed button. The Add Location dialog was the same, to the point where
 * clicking "Name (required)" did not even focus the field beside it.
 *
 * Fixed here rather than at each of the eighty-odd call sites, and without a
 * prop to remember: `Field` mints an id, gives it to the label's `htmlFor`, and
 * puts it on the context that `Input`, `Textarea` and `SelectTrigger` read. The
 * markup a writer of one of these panels has to get right is the wrapper they
 * were already writing.
 *
 * One control per `Field`. Two would share an id, which is worse than neither
 * having one — for a group of controls (a pair of Alive/Deceased buttons) the
 * shape is a `role="group"` with its own name, and for a label over something
 * that is not a control at all, see `FieldName`.
 */
const FieldIdContext = React.createContext<string | undefined>(undefined)

/** The id a `Field` minted for its control, unless the caller set its own. */
export function useFieldId(explicit?: string): string | undefined {
  const fromField = React.useContext(FieldIdContext)
  return explicit ?? fromField
}

interface FieldProps {
  label: React.ReactNode
  children: React.ReactNode
  className?: string
  labelClassName?: string
}

export function Field({ label, children, className, labelClassName }: FieldProps) {
  const id = React.useId()
  return (
    <FieldIdContext.Provider value={id}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        <Label htmlFor={id} className={labelClassName}>{label}</Label>
        {children}
      </div>
    </FieldIdContext.Provider>
  )
}

/**
 * A field's name where there is no single control for it to name.
 *
 * Reading mode renders the same panels as text, so "Status" sits above a
 * `<span>` saying Alive; "Inventory" sits above a list. A `<label>` pointing at
 * nothing is not a missing association, it is a false one — it tells a screen
 * reader a control is coming and then does not produce one. This is the same
 * text at the same weight, as a span.
 */
export function FieldName(
  { children, className, id }: { children: React.ReactNode; className?: string; id?: string },
) {
  return <span id={id} className={cn(labelClass, className)}>{children}</span>
}
