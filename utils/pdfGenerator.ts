import type { Idea, Evaluation } from '@/context/PlaybookContext';

type PlaybookSnapshot = {
  user: { name: string; age: number };
  step1: {
    problem: string;
    feelings: { mode: 'draw' | 'write'; content: string };
    sadSpace: { drawing: string; description: string };
    happySpace: { drawing: string; description: string };
  };
  step2: { who: string; what: string; when: string; why: string; wish: string };
  step3: { ideas: Idea[]; productStatement: string };
  step4: { evaluations: Evaluation[] };
  step5: {
    bestIdea: { mode: 'draw' | 'write'; content: string };
    ideaName: string;
    summary: string;
    signature?: { drawing: string };
  };
};

export function buildBackendPdfPayload(playbook: PlaybookSnapshot) {
  const responses: Record<string, unknown> = {};
  const images: Record<string, string> = {};

  const studentName = (playbook.user.name || '').trim();
  const studentAge = playbook.user.age ? String(playbook.user.age) : '';

  const feelingsText =
    playbook.step1.feelings.mode === 'write' ? (playbook.step1.feelings.content || '').trim() : '';
  const feelingsDrawing =
    playbook.step1.feelings.mode === 'draw' ? (playbook.step1.feelings.content || '').trim() : '';

  const problemStatement = (playbook.step1.problem || '').trim();
  const sadDrawing = (playbook.step1.sadSpace?.drawing || '').trim();
  const sadDesc = (playbook.step1.sadSpace?.description || '').trim();
  const happyDrawing = (playbook.step1.happySpace?.drawing || '').trim();
  const happyDesc = (playbook.step1.happySpace?.description || '').trim();
  const whoFacingProblem = (playbook.step2.who || '').trim();
  const whatHappening = (playbook.step2.what || '').trim();
  const whenWhere = (playbook.step2.when || '').trim();
  const whyProblem = (playbook.step2.why || '').trim();

  const ideaName = (playbook.step5.ideaName || '').trim();
  const solutionSummary = (playbook.step5.summary || '').trim();
  const bestIdeaText =
    playbook.step5.bestIdea.mode === 'write' ? (playbook.step5.bestIdea.content || '').trim() : '';
  const bestIdeaDrawing =
    playbook.step5.bestIdea.mode === 'draw' ? (playbook.step5.bestIdea.content || '').trim() : '';

  const safeNonEmpty = (value: string) => (value ? value : undefined);

  // Choose a "winning" idea from step4/step3 (used for selected_idea_* and prototype fallback)
  const byId = new Map<number, Idea>();
  for (const idea of playbook.step3.ideas || []) byId.set(idea.id, idea);

  const evaluations = playbook.step4.evaluations || [];
  const sorted = [...evaluations].sort((a, b) => {
    const aSolves = a.solvesProblem === 'yes' ? 1 : 0;
    const bSolves = b.solvesProblem === 'yes' ? 1 : 0;
    if (bSolves !== aSolves) return bSolves - aSolves;
    return (b.score || 0) - (a.score || 0);
  });
  const winning = sorted[0];
  const winningIdea = winning ? byId.get(winning.ideaId) : undefined;
  const winningIdeaText = winningIdea?.mode === 'write' ? (winningIdea.content || '').trim() : '';
  const winningIdeaDrawing = winningIdea?.mode === 'draw' ? (winningIdea.content || '').trim() : '';

  // PAGE 1: Cover
  if (studentName) responses.student_name = studentName;

  // PAGE 2: Optional welcome
  responses.welcome_message = safeNonEmpty(
    studentName ? `Welcome, ${studentName}! Let's start designing.` : `Welcome! Let's start designing.`
  );

  // PAGE 3: "This will help ___ because ___"
  responses.problem_statement = safeNonEmpty(problemStatement);
  // We treat "who" as who it helps, and merge the problem story into "because".
  responses.problem_who_it_helps = safeNonEmpty(whoFacingProblem);
  responses.problem_because = safeNonEmpty(
    [problemStatement && `Problem: ${problemStatement}`, whyProblem && `Because: ${whyProblem}`]
      .filter(Boolean)
      .join('\n')
  );

  // PAGE 4: Empathize grid
  responses.empathy_who = safeNonEmpty(whoFacingProblem);
  responses.empathy_what = safeNonEmpty(whatHappening);
  // The UI has a combined "When/Where" field, so we populate both to avoid blanks.
  responses.empathy_when = safeNonEmpty(whenWhere);
  responses.empathy_where = safeNonEmpty(whenWhere);
  responses.empathy_why = safeNonEmpty(whyProblem);
  responses.empathy_how = safeNonEmpty(feelingsText);

  // PAGE 5: User profile
  responses.user_name = safeNonEmpty(whoFacingProblem || studentName);
  responses.user_age = safeNonEmpty(studentAge);
  responses.user_problem = safeNonEmpty(whatHappening || problemStatement);
  responses.problem_when = safeNonEmpty(whenWhere);
  responses.user_feeling = safeNonEmpty(whyProblem || feelingsText);
  responses.user_wish = safeNonEmpty((playbook.step2.wish || '').trim() || solutionSummary);
  if (feelingsDrawing) images.user_profile_image = feelingsDrawing;

  // PAGE 6: Sad/Happy spaces
  if (sadDrawing) images.sad_space_drawing = sadDrawing;
  responses.sad_space_description = safeNonEmpty(sadDesc || whyProblem || feelingsText);
  if (happyDrawing) images.happy_space_drawing = happyDrawing;
  responses.happy_space_description = safeNonEmpty(happyDesc || solutionSummary);

  // PAGE 7: Product statement
  responses.product_statement = safeNonEmpty(
    (playbook.step3.productStatement || '').trim() ||
      [
        problemStatement && `Problem: ${problemStatement}`,
        whoFacingProblem && `For: ${whoFacingProblem}`,
        solutionSummary && `Solution: ${solutionSummary}`,
      ]
        .filter(Boolean)
        .join('\n')
  );

  // Crazy 6 ideas
  for (const idea of playbook.step3.ideas || []) {
    const id = idea.id;
    if (!id || id < 1 || id > 6) continue;
    const title = (idea.title || (idea.mode === 'write' ? idea.content : '') || '').trim();
    if (idea.mode === 'draw' && idea.content) images[`idea_${id}_drawing`] = idea.content;
    responses[`idea_${id}_title`] = title ? title : `Idea ${id}`;
  }

  // Validation table: backend expects {"Idea 1": true/false, ...}
  const scores: Record<string, boolean> = {
    'Idea 1': false,
    'Idea 2': false,
    'Idea 3': false,
    'Idea 4': false,
    'Idea 5': false,
    'Idea 6': false,
  };
  for (const evaluation of playbook.step4.evaluations || []) {
    const key = `Idea ${evaluation.ideaId}`;
    if (key in scores) scores[key] = evaluation.solvesProblem === 'yes';
  }
  responses.validation_scores = scores;

  // PAGE 9: Selected idea (use step5 name if provided, otherwise derive from evaluation)
  responses.selected_idea_name = safeNonEmpty(ideaName || winningIdeaText || (winning ? `Idea ${winning.ideaId}` : ''));
  const selectedDrawing = bestIdeaDrawing || winningIdeaDrawing;

  // NOTE: Do not place a large drawing onto the validation table page.
  // The template has a tight table layout and drawings can overlap it.

  // PAGE 10: Prototype
  responses.prototype_description = safeNonEmpty(ideaName || (winning ? `Idea ${winning.ideaId}` : ''));
  if (selectedDrawing) images.prototype_drawing = selectedDrawing;

  // PAGE 12: Final message (certificate)
  responses.final_message = safeNonEmpty(solutionSummary);

  return { responses, images };
}

export async function generatePDF(playbook: PlaybookSnapshot, filename: string = 'sns-playbook.pdf') {
  const configuredBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const backendFallback = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
  const backendUrl = (configuredBackendUrl ?? backendFallback).replace(/\/$/, '');
  const apiKey = process.env.NEXT_PUBLIC_PDF_API_KEY;

  const { responses, images } = buildBackendPdfPayload(playbook);

  const res = await fetch(`${backendUrl}/api/generate-pdf-direct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'X-API-Key': apiKey } : {}),
    },
    body: JSON.stringify({
      responses,
      images,
      filename,
    }),
  });

  if (!res.ok) {
    let details = '';
    try {
      details = await res.text();
    } catch {
      // ignore
    }
    throw new Error(`Backend PDF generation failed (${res.status}): ${details || res.statusText}`);
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function printPage() {
  window.print();
}
