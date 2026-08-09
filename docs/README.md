# Phase Learning and Delivery Reports

This directory records what Overworld Atlas actually delivered and learned in each completed roadmap phase. It is a retrospective record, not a replacement for current requirements in `PRODUCT_REQUIREMENTS.md`, repository rules in `AGENTS.md`, or the roadmap in `.agents/skills/overworld-atlas-webapp/SKILL.md`.

Codex creates or updates one report when an entire phase is accepted. A phase is not marked complete in `README.md` until its report is current.

## File Naming

Use `phase-XX-short-name.md`, with a zero-padded phase number and a stable descriptive name.

## Required Report Structure

Each report should include:

1. Phase status, completion date, outcome, and final scope boundary.
2. Frontend work implemented by Codex.
3. Backend work implemented by the owner.
4. Shared contracts, decisions, and integration work.
5. Backend, frontend, and cross-cutting concepts covered.
6. Verification evidence, including the checks that passed and any important manual validation.
7. Deferred work and the reason it remains outside the completed phase.
8. A senior-engineer report on the owner's backend work.

If a phase contains no frontend or no backend implementation, state that plainly. Do not inflate the report with work that did not happen.

## Owner Feedback Standard

The engineering report is developmental feedback, not a school grade. Base it only on evidence available from planning discussions, reviewed changes, tests, debugging, and the owner's explanations.

Include:

- Strengths the owner demonstrated, tied to concrete evidence
- One or more areas where their reasoning or execution can become stronger
- A practical focus for the next phase
- Any limits on the assessment when Codex did not directly observe part of the work

Do not infer motivation, confidence, or understanding from missing evidence. Do not assign a numeric or letter grade unless the owner explicitly asks for one.

## Relationship to TODO Files

Backend `TODO.md` files are forward-looking senior-to-junior assignments owned by the active phase. They explain what the owner is responsible for, why it matters, the concepts to practise, acceptance criteria, verification, and the review handoff without supplying implementation code or pseudocode by default.

Phase reports are backward-looking acceptance records. Once a phase is complete, the report captures the final truth even if an earlier TODO changed during implementation.
