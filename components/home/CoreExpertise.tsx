const EXPERTISE: ReadonlyArray<string> = [
  'React',
  'Next.js',
  'React Native',
  'TypeScript',
  'Node.js',
  'Micro Frontends',
  'Agentic AI',
  'Agent Architecture',
  'Harness Engineering',
  'AI / LLM Systems',
  'RAG · Vector DBs',
  'Cloud Architecture',
  'Azure DevOps',
  'AWS',
];

/**
 * Core-expertise chip cloud (V2 mock).
 */
export function CoreExpertise() {
  return (
    <section className="expertise" aria-labelledby="expertise-title">
      <div className="container">
        <h2 id="expertise-title" className="section-label">
          Core Expertise
        </h2>
        <ul className="chip-cloud">
          {EXPERTISE.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
