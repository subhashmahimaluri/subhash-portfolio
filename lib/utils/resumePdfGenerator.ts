import { BaseResumeData, Country, Experience, Project, Education, Certification, Language } from '../../types/resume';

function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Escape HTML, then promote **bold** markdown to <strong>. */
function processText(text: string): string {
  if (!text) return '';
  return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(value: string): string {
  if (!value || value.toLowerCase() === 'present') return 'Present';
  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) return escapeHtml(value);
  return `${MONTHS[parseInt(match[2], 10) - 1]} ${match[1]}`;
}

function username(url: string): string {
  if (!url) return '';
  return escapeHtml(url.replace(/\/+$/, '').split('/').pop() || url);
}

const SKILL_GROUPS: ReadonlyArray<{ label: string; key: keyof BaseResumeData['skills'] }> = [
  { label: 'Frontend Technologies', key: 'frontend' },
  { label: 'Backend &amp; APIs', key: 'backend' },
  { label: 'Cloud &amp; DevOps', key: 'cloud' },
  { label: 'Testing &amp; Quality', key: 'testing' },
  { label: 'AI &amp; Automation', key: 'ai' },
  { label: 'Architecture &amp; Design', key: 'architecture' },
  { label: 'Core Competencies', key: 'coreCompetencies' },
];

export function generateResumeHTML(data: BaseResumeData, country: Country): string {
  const { personalInfo, experience, skills, education, certifications, languages } = data;
  const summary = data.professionalSummary ?? personalInfo.summary;

  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 14mm; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 10pt; line-height: 1.42; color: #1a1a1a; background: #fff;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    h1 { font-size: 23pt; font-weight: 800; color: #0b2545; letter-spacing: -0.5px; }
    .subtitle { font-size: 10.5pt; font-weight: 700; color: #1a3a6e; margin-top: 3px; }
    .contact-info { font-size: 8.8pt; color: #444; margin-top: 7px; padding-bottom: 9px; border-bottom: 2px solid #1a3a6e; }
    .contact-info a { color: #1a3a6e; text-decoration: none; }
    .contact-info .sep { color: #bbb; margin: 0 6px; }
    h2 {
      font-size: 12.5pt; font-weight: 800; color: #1a3a6e; text-transform: uppercase; letter-spacing: 0.5px;
      margin-top: 14px; margin-bottom: 7px; border-bottom: 1.5px solid #d6dde8; padding-bottom: 3px;
      page-break-after: avoid;
    }
    p { margin-bottom: 6px; }
    .summary { font-size: 9.6pt; color: #2a2a2a; text-align: justify; }
    .experience-item { margin-bottom: 11px; page-break-inside: avoid; }
    h3 { font-size: 11pt; font-weight: 700; color: #111; margin-bottom: 1px; page-break-after: avoid; }
    .meta { font-size: 8.6pt; color: #555; font-weight: 600; margin-bottom: 3px; }
    ul { margin: 3px 0 5px 16px; }
    li { font-size: 9.3pt; line-height: 1.34; color: #1a1a1a; margin-bottom: 2.5px; }
    .project { margin: 5px 0 5px 6px; padding-left: 9px; border-left: 2px solid #d6dde8; }
    h4 { font-size: 9.8pt; font-weight: 700; color: #1a3a6e; margin-bottom: 1px; }
    h4 a { color: #1a3a6e; text-decoration: none; }
    .tech { font-size: 8.7pt; color: #555; margin-top: 2px; }
    .tech strong { color: #1a3a6e; }
    .core-skills { background: #f3f6fb; border: 1px solid #e1e8f2; border-radius: 4px; padding: 7px 10px; margin-bottom: 9px; font-size: 9pt; }
    .core-skills strong { color: #1a3a6e; }
    .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 18px; }
    .skill-category { margin-bottom: 4px; page-break-inside: avoid; font-size: 9pt; }
    .skill-category strong { color: #1a3a6e; }
    .education-item { font-size: 9.5pt; margin-bottom: 4px; page-break-inside: avoid; }
    .education-item strong { color: #111; }
    .references { text-align: center; font-style: italic; color: #777; font-size: 9pt; margin-top: 18px; }
    @media print { h2, h3, h4 { page-break-after: avoid; } li { page-break-inside: avoid; } }
  `;

  const contactParts: string[] = [
    `<a href="mailto:${escapeHtml(personalInfo.email)}">${escapeHtml(personalInfo.email)}</a>`,
    escapeHtml(personalInfo.phone),
    escapeHtml(personalInfo.location),
  ];
  if (personalInfo.website) {
    const site = personalInfo.website.replace(/^https?:\/\//, '');
    contactParts.push(`<a href="${escapeHtml(personalInfo.website)}">${escapeHtml(site)}</a>`);
  }
  contactParts.push(`LinkedIn: ${username(personalInfo.linkedin)}`);
  contactParts.push(`GitHub: ${username(personalInfo.github)}`);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(personalInfo.name)} — Resume</title>
  <style>${css}</style>
</head>
<body>
  <h1>${processText(personalInfo.name)}</h1>
  <div class="subtitle">${processText(personalInfo.title)}</div>
  <div class="contact-info">${contactParts.join('<span class="sep">|</span>')}</div>`;

  if (summary) {
    html += `
  <h2>Professional Summary</h2>
  <p class="summary">${processText(summary)}</p>`;
  }

  html += `
  <h2>Professional Experience</h2>`;
  experience.forEach((exp: Experience) => {
    html += `
  <div class="experience-item">
    <h3>${processText(exp.role)} at ${processText(exp.company)}</h3>
    <div class="meta">${processText(exp.location)} | ${formatDate(exp.startDate)} – ${formatDate(exp.endDate)}</div>
    <ul>${exp.highlights.map((hl) => `<li>${processText(hl)}</li>`).join('')}</ul>`;
    if (exp.projects && exp.projects.length > 0) {
      exp.projects.forEach((project: Project) => {
        html += `
    <div class="project">
      <h4>${
        project.link
          ? `<a href="${escapeHtml(project.link)}">${processText(project.name)}</a>`
          : processText(project.name)
      } (${processText(project.duration)})</h4>
      <ul>${project.description.map((d) => `<li>${processText(d)}</li>`).join('')}${(project.highlights || [])
          .map((h) => `<li>${processText(h)}</li>`)
          .join('')}</ul>${
          project.technologies && project.technologies.length > 0
            ? `<p class="tech"><strong>Technologies:</strong> ${processText(project.technologies.join(', '))}</p>`
            : ''
        }
    </div>`;
      });
    }
    html += `
  </div>`;
  });

  html += `
  <h2>Technical Expertise</h2>`;
  if (skills.coreSkills && skills.coreSkills.length > 0) {
    html += `
  <div class="core-skills"><strong>Core Skills:</strong> ${processText(skills.coreSkills.join(' • '))}</div>`;
  }
  html += `
  <div class="skills-grid">${SKILL_GROUPS.filter((g) => (skills[g.key] as string[] | undefined)?.length)
    .map(
      (g) =>
        `<div class="skill-category"><strong>${g.label}:</strong> ${processText(
          (skills[g.key] as string[]).join(', '),
        )}</div>`,
    )
    .join('')}</div>`;

  if (data.workAuthorization) {
    html += `
  <h2>Work Authorization</h2>
  <p>${processText(data.workAuthorization)}</p>`;
  }

  if (country === 'uae' && data.availability) {
    html += `
  <h2>Availability &amp; Engagement Model</h2>
  <p>${processText(data.availability)}</p>`;
  }

  html += `
  <h2>Education</h2>`;
  education.forEach((edu: Education) => {
    html += `
  <div class="education-item">${processText(edu.degree)} in ${processText(edu.field)}${
      edu.institution ? ` - ${processText(edu.institution)}` : ''
    }${edu.year ? ` (${processText(edu.year)})` : ''}</div>`;
  });

  if (country !== 'uk' && certifications && certifications.length > 0) {
    html += `
  <h2>Certifications</h2>
  <ul>${certifications
    .map(
      (cert: Certification) =>
        `<li>${processText(cert.name)}${cert.issuer ? ` (${processText(cert.issuer)})` : ''}${
          cert.year ? `, ${processText(cert.year)}` : ''
        }</li>`,
    )
    .join('')}</ul>`;
  }

  if (languages && languages.length > 0) {
    html += `
  <h2>Languages</h2>
  <p>${languages
    .map((lang: Language) => `<strong>${processText(lang.language)}</strong>: ${processText(lang.proficiency)}`)
    .join(' &nbsp;|&nbsp; ')}</p>`;
  }

  if (data.references) {
    html += `
  <p class="references">${processText(data.references)}</p>`;
  }

  html += `
</body>
</html>`;

  return html;
}
