// Resume Template Renderers for ResuMetric

/**
 * Main function to generate the complete HTML structure of the resume preview.
 * @param {Object} data - Resume data containing personal info, education, etc.
 * @returns {string} Compiled HTML string.
 */
function renderResume(data) {
  const templateId = data.templateId || 'professional';
  const styles = data.styles || {};
  
  // Base classes
  let classes = `resume-sheet template-${templateId}`;
  if (styles.highlightSkillsBg) {
    classes += ' resume-skills-bg';
  }

  // Inline styling for theme overrides
  const inlineStyles = `
    --theme-color: ${styles.themeColor || '#0046E5'};
    --resume-font: ${styles.fontFamily === 'serif' ? 'var(--font-serif)' : styles.fontFamily === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)'};
    --resume-padding: ${styles.margins || '20'}px;
  `;

  // Render based on selected template
  switch (templateId) {
    case 'modern':
      return renderModern(data, classes, inlineStyles);
    case 'student':
      return renderStudent(data, classes, inlineStyles);
    case 'minimal':
      return renderMinimal(data, classes, inlineStyles);
    case 'professional':
    default:
      return renderProfessional(data, classes, inlineStyles);
  }
}

// Icon SVG Helper strings
const icons = {
  email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`
};

/**
 * 1. PROFESSIONAL TEMPLATE RENDERER
 */
function renderProfessional(data, classes, inlineStyles) {
  const p = data.personal || {};
  const hasPhoto = data.styles.displayPhoto && p.photoDataUrl;

  return `
    <div class="${classes}" style="${inlineStyles}">
      <div class="resume-header-row">
        <div class="resume-header-info">
          <h1 class="resume-name">${p.fullName || 'Your Name'}</h1>
          <div class="resume-subtitle">MCA Graduate & Software Developer</div>
        </div>
        ${hasPhoto ? `<img src="${p.photoDataUrl}" alt="${p.fullName}" class="resume-portrait-circle">` : ''}
      </div>

      <div class="resume-contact-bar">
        ${p.email ? `<div class="resume-contact-item">${icons.email}<span>${p.email}</span></div>` : ''}
        ${p.phone ? `<div class="resume-contact-item">${icons.phone}<span>${p.phone}</span></div>` : ''}
        ${p.location ? `<div class="resume-contact-item">${icons.location}<span>${p.location}</span></div>` : ''}
        ${p.linkedin ? `<div class="resume-contact-item">${icons.linkedin}<span>${p.linkedin}</span></div>` : ''}
        ${p.github ? `<div class="resume-contact-item">${icons.github}<span>${p.github}</span></div>` : ''}
      </div>

      <!-- Summary -->
      ${data.objective ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Professional Summary</h2>
          <p class="resume-summary-text">${data.objective}</p>
        </div>
      ` : ''}

      <!-- Experience -->
      ${data.experience && data.experience.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Professional Experience</h2>
          ${data.experience.map(exp => `
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span class="resume-entry-title">${exp.role || 'Role'}</span>
                <span class="resume-entry-date">${exp.duration || ''}</span>
              </div>
              <div class="resume-entry-subtitle">${exp.company || ''}</div>
              ${exp.bullets && exp.bullets.length > 0 ? `
                <ul class="resume-entry-bullets">
                  ${exp.bullets.map(b => `<li class="resume-bullet-point">${b}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Projects -->
      ${data.projects && data.projects.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Academic & Personal Projects</h2>
          ${data.projects.map(proj => `
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span class="resume-entry-title">${proj.title || 'Project Title'}</span>
                <span class="resume-entry-date">${proj.duration || ''}</span>
              </div>
              <div class="resume-entry-subtitle">${proj.role || ''}</div>
              <p class="resume-bullet-point" style="margin-top: 4px; list-style-type: none;">${proj.description || ''}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Education -->
      ${data.education && data.education.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Education</h2>
          ${data.education.map(edu => `
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span class="resume-entry-title">${edu.degree || 'Degree'}</span>
                <span class="resume-entry-date">${edu.year || ''}</span>
              </div>
              <div class="resume-entry-subtitle">${edu.university || ''} ${edu.grade ? `| ${edu.grade}` : ''}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Technical Skills -->
      ${data.skills && data.skills.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Technical Expertise</h2>
          <div class="resume-skills-grid">
            ${data.skills.map(s => `<span class="resume-skill-tag">${s}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Certifications -->
      ${data.certifications && data.certifications.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Certifications</h2>
          ${data.certifications.map(cert => `
            <div class="resume-entry" style="margin-bottom: 8px;">
              <div class="resume-entry-header" style="align-items: center;">
                <span class="resume-entry-title">${cert.title || 'Certification'}</span>
                <span class="resume-entry-date">${cert.date || ''}</span>
              </div>
              <div class="resume-entry-subtitle" style="font-size: 11px;">Issued by ${cert.issuer || ''}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Languages & Achievements Bottom Row Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: auto;">
        ${data.languages ? `
          <div>
            <h3 class="resume-section-title" style="margin-bottom: 8px;">Languages</h3>
            <p style="font-size: 11px; color: #475569;">${data.languages}</p>
          </div>
        ` : ''}
        ${data.achievements ? `
          <div>
            <h3 class="resume-section-title" style="margin-bottom: 8px;">Achievements</h3>
            <p style="font-size: 11px; color: #475569; white-space: pre-line;">${data.achievements}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * 2. MODERN TEMPLATE RENDERER
 */
function renderModern(data, classes, inlineStyles) {
  const p = data.personal || {};
  const hasPhoto = data.styles.displayPhoto && p.photoDataUrl;

  return `
    <div class="${classes}" style="${inlineStyles}">
      <!-- Sidebar Column -->
      <div class="sidebar-col">
        ${hasPhoto ? `<img src="${p.photoDataUrl}" alt="${p.fullName}" class="resume-portrait-circle">` : ''}
        
        <div>
          <h1 class="resume-name">${p.fullName || 'Your Name'}</h1>
          <div class="resume-subtitle" style="color: var(--theme-color);">Software Engineer</div>
        </div>

        <div class="resume-contact-bar">
          ${p.email ? `<div class="resume-contact-item">${icons.email}<span>${p.email}</span></div>` : ''}
          ${p.phone ? `<div class="resume-contact-item">${icons.phone}<span>${p.phone}</span></div>` : ''}
          ${p.location ? `<div class="resume-contact-item">${icons.location}<span>${p.location}</span></div>` : ''}
          ${p.linkedin ? `<div class="resume-contact-item">${icons.linkedin}<span>${p.linkedin}</span></div>` : ''}
          ${p.github ? `<div class="resume-contact-item">${icons.github}<span>${p.github}</span></div>` : ''}
        </div>

        <!-- Skills -->
        ${data.skills && data.skills.length > 0 ? `
          <div>
            <h2 class="resume-section-title">Skills</h2>
            <div class="resume-skills-grid">
              ${data.skills.map(s => `<span class="resume-skill-tag">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Languages -->
        ${data.languages ? `
          <div>
            <h2 class="resume-section-title">Languages</h2>
            <p style="font-size: 11.5px; color: #CBD5E1;">${data.languages}</p>
          </div>
        ` : ''}
      </div>

      <!-- Main Column -->
      <div class="main-col">
        <!-- Summary -->
        ${data.objective ? `
          <div class="resume-section">
            <h2 class="resume-section-title">Profile</h2>
            <p class="resume-summary-text">${data.objective}</p>
          </div>
        ` : ''}

        <!-- Experience -->
        ${data.experience && data.experience.length > 0 ? `
          <div class="resume-section">
            <h2 class="resume-section-title">Work Experience</h2>
            ${data.experience.map(exp => `
              <div class="resume-entry">
                <div class="resume-entry-header">
                  <span class="resume-entry-title" style="color: #FFFFFF;">${exp.role || 'Role'}</span>
                  <span class="resume-entry-date">${exp.duration || ''}</span>
                </div>
                <div class="resume-entry-subtitle" style="color: var(--theme-color);">${exp.company || ''}</div>
                ${exp.bullets && exp.bullets.length > 0 ? `
                  <ul class="resume-entry-bullets">
                    ${exp.bullets.map(b => `<li class="resume-bullet-point">${b}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Projects -->
        ${data.projects && data.projects.length > 0 ? `
          <div class="resume-section">
            <h2 class="resume-section-title">Projects</h2>
            ${data.projects.map(proj => `
              <div class="resume-entry">
                <div class="resume-entry-header">
                  <span class="resume-entry-title" style="color: #FFFFFF;">${proj.title || 'Project'}</span>
                  <span class="resume-entry-date">${proj.duration || ''}</span>
                </div>
                <div class="resume-entry-subtitle">${proj.role || ''}</div>
                <p class="resume-bullet-point" style="margin-top: 4px; list-style-type: none;">${proj.description || ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${data.education && data.education.length > 0 ? `
          <div class="resume-section">
            <h2 class="resume-section-title">Education</h2>
            ${data.education.map(edu => `
              <div class="resume-entry">
                <div class="resume-entry-header">
                  <span class="resume-entry-title" style="color: #FFFFFF;">${edu.degree || 'Degree'}</span>
                  <span class="resume-entry-date">${edu.year || ''}</span>
                </div>
                <div class="resume-entry-subtitle">${edu.university || ''} ${edu.grade ? `| ${edu.grade}` : ''}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Achievements -->
        ${data.achievements ? `
          <div class="resume-section">
            <h2 class="resume-section-title">Achievements</h2>
            <p style="font-size: 11.5px; color: #CBD5E1; white-space: pre-line;">${data.achievements}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * 3. STUDENT TEMPLATE RENDERER
 */
function renderStudent(data, classes, inlineStyles) {
  const p = data.personal || {};
  const hasPhoto = data.styles.displayPhoto && p.photoDataUrl;

  return `
    <div class="${classes}" style="${inlineStyles}">
      <div class="resume-header-student">
        ${hasPhoto ? `<img src="${p.photoDataUrl}" alt="${p.fullName}" class="resume-portrait-square">` : ''}
        <div>
          <h1 class="resume-name" style="margin-bottom: 4px;">${p.fullName || 'Your Name'}</h1>
          <div class="resume-subtitle" style="font-size: 12px; margin-bottom: 12px;">Computer Applications Graduate</div>
          <div class="resume-contact-bar" style="margin-bottom: 0;">
            ${p.email ? `<div class="resume-contact-item">${icons.email}<span>${p.email}</span></div>` : ''}
            ${p.phone ? `<div class="resume-contact-item">${icons.phone}<span>${p.phone}</span></div>` : ''}
            ${p.location ? `<div class="resume-contact-item">${icons.location}<span>${p.location}</span></div>` : ''}
            ${p.linkedin ? `<div class="resume-contact-item">${icons.linkedin}<span>${p.linkedin}</span></div>` : ''}
            ${p.github ? `<div class="resume-contact-item">${icons.github}<span>${p.github}</span></div>` : ''}
          </div>
        </div>
      </div>

      <hr class="resume-divider" style="background-color: var(--theme-color); height: 2px;">

      <!-- Career Objective -->
      ${data.objective ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Career Objective</h2>
          <p class="resume-summary-text" style="font-style: italic;">${data.objective}</p>
        </div>
      ` : ''}

      <!-- Education first (Student focus) -->
      ${data.education && data.education.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Education</h2>
          ${data.education.map(edu => `
            <div class="resume-entry" style="margin-bottom: 10px;">
              <div class="resume-entry-header">
                <span class="resume-entry-title" style="color: var(--theme-color); font-size: 14px;">${edu.degree || 'Degree'}</span>
                <span class="resume-entry-date" style="font-weight: 600;">${edu.year || ''}</span>
              </div>
              <div class="resume-entry-subtitle" style="font-weight: 500;">${edu.university || ''} ${edu.grade ? `| <b>Grade:</b> ${edu.grade}` : ''}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Technical Skills (Important for students) -->
      ${data.skills && data.skills.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Technical Skills</h2>
          <div class="resume-skills-grid" style="margin-top: 6px;">
            ${data.skills.map(s => `<span class="resume-skill-tag" style="border-radius: 8px;">${s}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Projects -->
      ${data.projects && data.projects.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Key Projects</h2>
          ${data.projects.map(proj => `
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span class="resume-entry-title">${proj.title || 'Project'}</span>
                <span class="resume-entry-date">${proj.duration || ''}</span>
              </div>
              <div class="resume-entry-subtitle"><b>Role:</b> ${proj.role || ''}</div>
              <p class="resume-bullet-point" style="margin-top: 4px; list-style-type: none; font-size: 11px;">${proj.description || ''}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Internships / Experience -->
      ${data.experience && data.experience.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Experience & Internships</h2>
          ${data.experience.map(exp => `
            <div class="resume-entry">
              <div class="resume-entry-header">
                <span class="resume-entry-title">${exp.role || 'Role'}</span>
                <span class="resume-entry-date">${exp.duration || ''}</span>
              </div>
              <div class="resume-entry-subtitle">${exp.company || ''}</div>
              ${exp.bullets && exp.bullets.length > 0 ? `
                <ul class="resume-entry-bullets">
                  ${exp.bullets.map(b => `<li class="resume-bullet-point">${b}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Certifications -->
      ${data.certifications && data.certifications.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Certifications</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
            ${data.certifications.map(cert => `
              <div style="background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; display: flex; flex-direction: column;">
                <span style="font-size: 11.5px; font-weight: 700; color: #0F172A;">${cert.title}</span>
                <span style="font-size: 10.5px; color: #475569;">${cert.issuer} (${cert.date})</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Footer Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: auto; border-top: 1px solid var(--border-color); padding-top: 12px;">
        ${data.languages ? `
          <div>
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--theme-color); display: block; margin-bottom: 4px;">Languages</span>
            <p style="font-size: 11px; color: #475569;">${data.languages}</p>
          </div>
        ` : ''}
        ${data.achievements ? `
          <div>
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--theme-color); display: block; margin-bottom: 4px;">Achievements</span>
            <p style="font-size: 11px; color: #475569; white-space: pre-line;">${data.achievements}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * 4. MINIMAL TEMPLATE RENDERER
 */
function renderMinimal(data, classes, inlineStyles) {
  const p = data.personal || {};

  return `
    <div class="${classes}" style="${inlineStyles}">
      <div style="text-align: center; margin-bottom: 12px;">
        <h1 class="resume-name">${p.fullName || 'Your Name'}</h1>
        <div class="resume-subtitle">Minimal Blueprint</div>
      </div>

      <div class="resume-contact-bar">
        ${p.email ? `<div class="resume-contact-item"><span>${p.email}</span></div>` : ''}
        ${p.phone ? `<div class="resume-contact-item"><span>• &nbsp; ${p.phone}</span></div>` : ''}
        ${p.location ? `<div class="resume-contact-item"><span>• &nbsp; ${p.location}</span></div>` : ''}
        ${p.linkedin ? `<div class="resume-contact-item"><span>• &nbsp; ${p.linkedin}</span></div>` : ''}
        ${p.github ? `<div class="resume-contact-item"><span>• &nbsp; ${p.github}</span></div>` : ''}
      </div>

      <!-- Objective -->
      ${data.objective ? `
        <div class="resume-section" style="margin-bottom: 24px;">
          <p class="resume-summary-text" style="font-size: 13px; text-align: justify; line-height: 1.7; font-family: var(--font-serif);">${data.objective}</p>
        </div>
      ` : ''}

      <!-- Experience -->
      ${data.experience && data.experience.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Experience</h2>
          ${data.experience.map(exp => `
            <div class="resume-entry" style="margin-bottom: 18px;">
              <div class="resume-entry-header">
                <span class="resume-entry-title" style="font-size: 14px; font-family: var(--font-serif);">${exp.role || 'Role'}</span>
                <span class="resume-entry-date">${exp.duration || ''}</span>
              </div>
              <div class="resume-entry-subtitle" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">${exp.company || ''}</div>
              ${exp.bullets && exp.bullets.length > 0 ? `
                <ul class="resume-entry-bullets" style="margin-top: 6px;">
                  ${exp.bullets.map(b => `<li class="resume-bullet-point" style="font-size: 11.5px;">${b}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Projects -->
      ${data.projects && data.projects.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Projects</h2>
          ${data.projects.map(proj => `
            <div class="resume-entry" style="margin-bottom: 14px;">
              <div class="resume-entry-header">
                <span class="resume-entry-title" style="font-size: 13.5px;">${proj.title || 'Project'}</span>
                <span class="resume-entry-date">${proj.duration || ''}</span>
              </div>
              <div class="resume-entry-subtitle" style="font-size: 11px; font-style: italic;">Role: ${proj.role || ''}</div>
              <p class="resume-bullet-point" style="margin-top: 4px; list-style-type: none; font-size: 11.5px; line-height: 1.6;">${proj.description || ''}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Education -->
      ${data.education && data.education.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Education</h2>
          ${data.education.map(edu => `
            <div class="resume-entry" style="margin-bottom: 12px;">
              <div class="resume-entry-header">
                <span class="resume-entry-title" style="font-size: 13.5px;">${edu.degree || 'Degree'}</span>
                <span class="resume-entry-date">${edu.year || ''}</span>
              </div>
              <div class="resume-entry-subtitle" style="font-size: 11.5px;">${edu.university || ''} ${edu.grade ? `| ${edu.grade}` : ''}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Skills -->
      ${data.skills && data.skills.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Skills & Tech</h2>
          <div style="font-size: 11.5px; color: #475569; line-height: 1.6;">
            <b>Proficient in:</b> ${data.skills.join(', ')}
          </div>
        </div>
      ` : ''}

      <!-- Additional Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: auto; border-top: 1px solid var(--border-color); padding-top: 16px;">
        ${data.languages ? `
          <div>
            <h3 class="resume-section-title" style="font-size: 12px;">Languages</h3>
            <p style="font-size: 11.5px; font-family: var(--font-serif);">${data.languages}</p>
          </div>
        ` : ''}
        ${data.achievements ? `
          <div>
            <h3 class="resume-section-title" style="font-size: 12px;">Awards & Achievements</h3>
            <p style="font-size: 11.5px; font-family: var(--font-serif); white-space: pre-line;">${data.achievements}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
