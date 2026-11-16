# Changelog

All notable changes to the **Career Application Builder** project are documented below.

## [1.0.0] - 2026-06-03

### Added
- **Full-Stack Express Server (`server.ts`)**: Built safe, secure server endpoint to query `@google/genai` (utilizing standard `gemini-3.5-flash` model) and proxy client requests keeping the `GEMINI_API_KEY` hidden from the dashboard.
- **Client Frontend (`src/App.tsx`)**: Modularized React 19 interface showcasing three pane layout (Core Inputs, Center generated documents, Right action panel).
- **Core Models Types (`src/types.ts`)**: Rigorous, type-checked contract definitions for Career background profiles, AI extracted listings, Match scoring, and persistence packets.
- **Resume Tailoring Previewer (`src/components/ResumeViewer.tsx`)**: Interactive printable layout that mirrors high-contrast paper drafts with instant in-line edits on sections.
- **Tailored Letter Blueprint (`src/components/CoverLetterViewer.tsx`)**: Customized letterheads featuring tone controls, target matching, and copy commands.
- **Application Roadmap Tracker (`src/components/ChecklistViewer.tsx`)**: Automatically customizable 10-tier checkpoints with custom task additions.
- **Match Score Dashboard (`src/components/AnalysisViewer.tsx`)**: circular Job Fit rating with keywords tagging, softwares, flags, and alignment tips.
- **Workspace Notepad (`src/components/NotesSection.tsx`)**: Easy-to-use temporary work notepad.
- **Baseline Profile Facts (`src/components/ProfileEditor.tsx`)**: Integrated editable baseline containing default OSP Civil drafting and technical technician specifications.
- **Saved Application Packets List (`src/components/SavedPacketsList.tsx`)**: Syncs and browsers active or historical pipelines from browser `localStorage`.
