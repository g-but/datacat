This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---
created_date: 2024-07-08
last_modified_date: 2025-07-08
last_modified_summary: "Switched form builder to a single Zustand store; added usage guidelines and API overview."

---

# Neuerungen ab 2024-07-08

## Drag-and-Drop Sortierung

Das zentrale Formular-Canvas unterstützt jetzt modernes Drag-and-Drop über **@dnd-kit**. So funktioniert's:

1. Bewegen Sie den Mauszeiger über ein Feld, bis der Cursor zur "Hand" wird.
2. Klicken, halten und ziehen Sie das Feld an die gewünschte Stelle.
3. Die benachbarten Felder gleiten nach oben / unten, sodass klar ersichtlich ist, wo das Element landet.

### Technische Details

- Bibliotheken: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`  
- Implementation: `ModernFormBuilderLayout` verwendet `DndContext` + `SortableContext`.  
- Jedes Feld wird durch die neue **`SortableField`**-Komponente umhüllt, welche `useSortable` nutzt.

## Schritt-Titel bearbeiten

Im **Steps**-Tab der Sidebar kann der Titel eines Schrittes jetzt inline editiert werden:

1. Titel anklicken  
2. Neuen Namen eintippen  
3. Mit **Enter** bestätigen oder Fokus verlieren.  
4. **Esc** bricht den Vorgang ab.

Die Änderung wird via `onUpdateStep` sofort ins Formularmodell übernommen.

## Duplizieren-Bug behoben

Ein einzelner Klick auf das Kopier-Icon erstellt nur noch **eine** Kopie.  
Grund war ein doppeltes Event-Feuern; durch `e.stopPropagation()` im Button behoben.

## Installation

Falls Sie das Projekt zum ersten Mal auschecken oder neue Abhängigkeiten installieren möchten:

```bash
cd frontend
npm install
```

Die neuen DnD-Bibliotheken werden automatisch mitinstalliert.

## Neuerungen ab 2025-07-08

## Global State with Zustand

The form builder (builder canvas, sidebar, and multi-step editor) now shares a single source of truth provided by **Zustand** (`src/app/hooks/useFormBuilderStore.ts`).

### Benefits

1. No more prop-drilling of `fields`, `steps`, or `currentStep`.
2. Future features (undo/redo, collaboration, analytics) can plug into the store.
3. Cleaner component APIs.

### Key Store API

```
addField(field, stepId?)
updateField(fieldId, updates)
duplicateField(fieldId)
removeField(fieldId)
reorderField(from, to)

addStep(step) / updateStep(stepId, updates) / removeStep(stepId)
reorderStep(from, to)

toggleMultiStep()
setCurrentStep(index)
setFields(array)  // bulk replace
setSteps(array)   // bulk replace
```

### Component Changes

| Old Component | New Wrapper | Purpose |
|---------------|------------|---------|
| `ModernSidebar` | `ModernSidebarStore` | Injects store values/actions |
| `MultiStepFormBuilder` | `MultiStepFormBuilderStore` | Same, for steps |

Existing props still work, so gradual migration is possible.

### Migration Guide for Your Own Components

1. Import the hook: `const { fields } = useFormBuilderStore();`
2. Derive local UI state from the store rather than props.
3. Dispatch actions instead of lifting state up.

```tsx
import { useFormBuilderStore } from '../hooks/useFormBuilderStore';

function RequiredFieldBadge({ fieldId }: { fieldId: string }) {
  const required = useFormBuilderStore((s) => s.fields.find(f => f.id === fieldId)?.required);
  return required ? <span>*</span> : null;
}
```

---
