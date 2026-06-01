import { BaseResumeData, Country } from '../../types/resume';

function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function processText(text: string): string {
  if (!text) return '';
  const escaped = escapeHtml(text);
  return escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export function generateResumeHTML(data: BaseResumeData, country: Country): string {
  const css = `
    @page { size: A4; margin: 15mm; }
    body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #333; margin: 0; padding: 0; }
    h1 { font-size: 24px; margin-bottom: 5px; color: #000; }
    h2 { font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-top: 15px; margin-bottom: 10px; color: #222; }
    h3 { font-size: 14px; margin-bottom: 5px; color: #333; }
    p { margin: 0 0 8px 0; }
    ul { margin: 0 0 10px 0; padding-left: 20px; }
    li { margin-bottom: 4px; }
    .header { text-align: center; margin-bottom: 20px; }
    .contact-info { font-size: 11px; color: #555; }
    .experience-item { page-break-inside: avoid; margin-bottom: 15px; }
    .experience-header { display: flex; justify-content: space-between; align-items: baseline; }
    .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  `;

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resume</title>
  <style>${css}</style>
</head>
<body>
  <div class="header">
    <h1>${processText(data.personalInfo.name)}</h1>
    <div class="contact-info">
      ${processText(data.personalInfo.email)} | ${processText(data.personalInfo.phone)} | ${processText(data.personalInfo.location)}
    </div>
  </div>`;

  if (data.professionalSummary) {
    html += `
  <h2>Professional Summary</h2>
  <p>${processText(data.professionalSummary)}</p>`;
  }

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
  <h2>Experience</h2>`;
  
  data.experience.forEach(exp => {
    html += `
  <div class="experience-item">
    <div class="experience-header">
      <h3>${processText(exp.role)} at ${processText(exp.company)}</h3>
      <span>${processText(exp.startDate)} - ${processText(exp.endDate)}</span>
    </div>
    <ul>`;
    exp.highlights.forEach(hl => {
      html += `<li>${processText(hl)}</li>`;
    });
    html += `</ul>
  </div>`;
  });

  html += `
  <h2>Skills</h2>
  <div class="skills-grid">
    <div><strong>Frontend:</strong> ${processText(data.skills.frontend.join(', '))}</div>
    <div><strong>Backend:</strong> ${processText(data.skills.backend.join(', '))}</div>
  </div>`;

  html += `
  <h2>Education</h2>
  <ul>`;
  data.education.forEach(edu => {
    html += `<li>${processText(edu.degree)} in ${processText(edu.field)}${edu.institution ? ` - ${processText(edu.institution)}` : ''}</li>`;
  });
  html += `</ul>`;

  if (country !== 'uk' && data.certifications && data.certifications.length > 0) {
    html += `
  <h2>Certifications</h2>
  <ul>`;
    data.certifications.forEach(cert => {
      html += `<li>${processText(cert.name)}${cert.issuer ? ` (${processText(cert.issuer)})` : ''}</li>`;
    });
    html += `</ul>`;
  }

  html += `
</body>
</html>`;

  return html;
}
