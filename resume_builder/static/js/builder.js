// ResuMetric Redesigned Builder Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. STATE & DATA INITIALIZATION
  let resumeData = loadResumeData();
  
  // Cache DOM Elements
  const viewEditor = document.getElementById('view-saas-editor');
  const viewLayout = document.getElementById('view-saas-layout');
  const viewStyles = document.getElementById('view-saas-styles');
  const viewAts = document.getElementById('view-saas-ats');
  const viewExport = document.getElementById('view-saas-export');
  
  const dashboardContainer = document.getElementById('dashboard-container');
  const dashboardLeft = document.getElementById('dashboard-left');
  const dashboardRight = document.getElementById('dashboard-right');
  const previewPaper = document.getElementById('preview-paper-container');
  const progressBar = document.getElementById('progress-bar');
  
  // Tab Switchers (Left Sidebar & Mobile Bottom Nav)
  const tabButtons = document.querySelectorAll('.sidebar-btn, .nav-tab-item');
  const mobileEditBtn = document.getElementById('btn-mobile-edit');
  const sidebarNameDisplay = document.getElementById('sidebar-name-display');
  
  // Personal Info Inputs
  const inputFullName = document.getElementById('input-full-name');
  const inputEmail = document.getElementById('input-email');
  const inputPhone = document.getElementById('input-phone');
  const inputLocation = document.getElementById('input-location');
  const inputLinkedin = document.getElementById('input-linkedin');
  const inputGithub = document.getElementById('input-github');
  const portraitInput = document.getElementById('portrait-upload-input');
  const photoUploadWrapper = document.getElementById('photo-upload-icon-wrapper');
  
  // Other Inputs
  const inputObjective = document.getElementById('input-objective');
  const inputLanguages = document.getElementById('input-languages');
  const inputAchievements = document.getElementById('input-achievements');
  
  // Lists Containers
  const educationContainer = document.getElementById('education-list-container');
  const experienceContainer = document.getElementById('experience-list-container');
  const projectContainer = document.getElementById('project-list-container');
  const certificationContainer = document.getElementById('certification-list-container');
  
  // Skills tags
  const skillsInput = document.getElementById('input-skills');
  const skillsTagsContainer = document.getElementById('skills-tags-container');
  
  // Dynamic action buttons
  const btnAddEdu = document.getElementById('btn-add-education');
  const btnAddExp = document.getElementById('btn-add-experience');
  const btnAddProj = document.getElementById('btn-add-project');
  const btnAddCert = document.getElementById('btn-add-certification');
  
  // PDF download buttons
  const btnExportPdf = document.getElementById('btn-saas-export') || document.getElementById('btn-export-pdf');
  const headerDownloadBtn = document.getElementById('header-download-btn');

  // Styles Customizers
  const colorPresetBtns = document.querySelectorAll('.color-preset-btn');
  const fontPresetBtns = document.querySelectorAll('.font-preset-btn');
  const inputMargins = document.getElementById('input-margins');
  const labelMargins = document.getElementById('label-margins');
  const togglePhoto = document.getElementById('toggle-photo');
  const toggleSkillsBg = document.getElementById('toggle-skills-bg');
  const themeSwitchBtns = document.querySelectorAll('#theme-switch-container .theme-switch-btn');

  // ==========================================
  // 2. TAB SWITCHING SYSTEM
  // ==========================================
  function switchTab(tabName) {
    // Sync active state across both sidebar buttons and bottom mobile tabs
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Hide all views
    viewEditor.classList.remove('active');
    viewLayout.classList.remove('active');
    viewStyles.classList.remove('active');
    viewAts.classList.remove('active');
    viewExport.classList.remove('active');
    
    // Hide preview pane styling for mobile
    dashboardContainer.classList.remove('preview-active');

    // Show correct view
    if (tabName === 'editor') {
      viewEditor.classList.add('active');
    } else if (tabName === 'layout') {
      viewLayout.classList.add('active');
      renderLayoutTab();
    } else if (tabName === 'styles') {
      viewStyles.classList.add('active');
      initStylesTab();
    } else if (tabName === 'ats') {
      viewAts.classList.add('active');
      updateAtsPanel();
    } else if (tabName === 'export') {
      viewExport.classList.add('active');
      // Update template name inside the export view details
      const tName = resumeData.templateId.charAt(0).toUpperCase() + resumeData.templateId.slice(1);
      document.getElementById('export-template-display-name').textContent = `${tName} Template`;
      
      // On mobile/tablet, reveal the Live Preview pane
      dashboardContainer.classList.add('preview-active');
    }
  }

  // Bind Sidebar & Mobile bottom tabs
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // Switch to Editor mobile button helper
  if (mobileEditBtn) {
    mobileEditBtn.addEventListener('click', () => {
      switchTab('editor');
    });
  }

  // Handle URL parameters on initial load
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'editor';
  const initialTemplate = urlParams.get('template');
  
  if (initialTemplate) {
    resumeData.templateId = initialTemplate;
    saveResumeData(resumeData);
  }
  switchTab(initialTab);

  // ==========================================
  // 3. SKILLS TAG INPUT SYSTEM
  // ==========================================
  function renderSkillsTags() {
    const existingTags = skillsTagsContainer.querySelectorAll('.saas-tag');
    existingTags.forEach(tag => tag.remove());

    resumeData.skills.forEach((skill, index) => {
      const tag = document.createElement('div');
      tag.className = 'saas-tag';
      tag.innerHTML = `
        <span>${skill}</span>
        <button type="button" class="saas-tag-remove" data-index="${index}">&times;</button>
      `;
      skillsTagsContainer.insertBefore(tag, skillsInput);
    });

    // Bind remove event listeners
    skillsTagsContainer.querySelectorAll('.saas-tag-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        resumeData.skills.splice(index, 1);
        saveAndUpdate();
        renderSkillsTags();
      });
    });
  }

  skillsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = skillsInput.value.trim();
      if (val && !resumeData.skills.includes(val)) {
        resumeData.skills.push(val);
        skillsInput.value = '';
        saveAndUpdate();
        renderSkillsTags();
      }
    }
  });

  skillsTagsContainer.addEventListener('click', (e) => {
    if (e.target === skillsTagsContainer) {
      skillsInput.focus();
    }
  });


  // ==========================================
  // 4. PORTRAIT / PHOTO UPLOAD
  // ==========================================
  portraitInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        resumeData.personal.photoDataUrl = evt.target.result;
        updatePhotoUploadUI();
        saveAndUpdate();
      };
      reader.readAsDataURL(file);
    }
  });

  function updatePhotoUploadUI() {
    if (resumeData.personal.photoDataUrl) {
      photoUploadWrapper.innerHTML = `<img src="${resumeData.personal.photoDataUrl}" alt="Portrait">`;
    } else {
      photoUploadWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="4"/></svg>`;
    }
  }


  // ==========================================
  // 5. DYNAMIC SECTIONS (ADD / REMOVE)
  // ==========================================
  
  // Education List
  function renderEducationList() {
    educationContainer.innerHTML = '';
    resumeData.education.forEach((edu, idx) => {
      const card = document.createElement('div');
      card.className = 'saas-dynamic-card';
      card.innerHTML = `
        <button type="button" class="btn-saas-remove" data-index="${idx}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
        <div class="saas-form-group">
          <label class="saas-label">University / College</label>
          <input type="text" class="saas-control edu-university" value="${edu.university || ''}" placeholder="University Name" data-index="${idx}">
        </div>
        <div class="saas-form-grid">
          <div class="saas-form-group">
            <label class="saas-label">Degree / Program</label>
            <input type="text" class="saas-control edu-degree" value="${edu.degree || ''}" placeholder="e.g. Master of Computer Applications (MCA)" data-index="${idx}">
          </div>
          <div class="saas-form-group">
            <label class="saas-label">Passing Year / Grade</label>
            <input type="text" class="saas-control edu-year" value="${edu.year || ''}" placeholder="e.g. 2022 - 2024" data-index="${idx}">
          </div>
        </div>
      `;
      educationContainer.appendChild(card);
    });

    // Inputs listener
    educationContainer.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (e.target.classList.contains('edu-university')) {
          resumeData.education[index].university = e.target.value;
        } else if (e.target.classList.contains('edu-degree')) {
          resumeData.education[index].degree = e.target.value;
        } else if (e.target.classList.contains('edu-year')) {
          resumeData.education[index].year = e.target.value;
        }
        saveAndUpdate();
      });
    });

    // Remove buttons listener
    educationContainer.querySelectorAll('.btn-saas-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        resumeData.education.splice(index, 1);
        renderEducationList();
        saveAndUpdate();
      });
    });
  }

  btnAddEdu.addEventListener('click', () => {
    resumeData.education.push({
      id: 'edu-' + Date.now(),
      university: '',
      degree: '',
      year: '',
      grade: ''
    });
    renderEducationList();
    saveAndUpdate();
  });

  // Experience List
  function renderExperienceList() {
    experienceContainer.innerHTML = '';
    resumeData.experience.forEach((exp, idx) => {
      const card = document.createElement('div');
      card.className = 'saas-dynamic-card';
      card.innerHTML = `
        <button type="button" class="btn-saas-remove" data-index="${idx}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
        <div class="saas-form-group">
          <label class="saas-label">Role / Job Title</label>
          <input type="text" class="saas-control exp-role" value="${exp.role || ''}" placeholder="e.g. Full-Stack Development Intern" data-index="${idx}">
        </div>
        <div class="saas-form-grid">
          <div class="saas-form-group">
            <label class="saas-label">Company / Location</label>
            <input type="text" class="saas-control exp-company" value="${exp.company || ''}" placeholder="e.g. TechVision Systems | Remote" data-index="${idx}">
          </div>
          <div class="saas-form-group">
            <label class="saas-label">Duration</label>
            <input type="text" class="saas-control exp-duration" value="${exp.duration || ''}" placeholder="e.g. Jun 2024 - Present" data-index="${idx}">
          </div>
        </div>
        <div class="saas-form-group">
          <label class="saas-label">Key Duties (One per line)</label>
          <textarea class="saas-control exp-bullets" placeholder="Architected and implemented a real-time dashboard..." data-index="${idx}">${(exp.bullets || []).join('\n')}</textarea>
        </div>
      `;
      experienceContainer.appendChild(card);
    });

    experienceContainer.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (e.target.classList.contains('exp-role')) {
          resumeData.experience[index].role = e.target.value;
        } else if (e.target.classList.contains('exp-company')) {
          resumeData.experience[index].company = e.target.value;
        } else if (e.target.classList.contains('exp-duration')) {
          resumeData.experience[index].duration = e.target.value;
        } else if (e.target.classList.contains('exp-bullets')) {
          resumeData.experience[index].bullets = e.target.value.split('\n').filter(line => line.trim() !== '');
        }
        saveAndUpdate();
      });
    });

    experienceContainer.querySelectorAll('.btn-saas-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        resumeData.experience.splice(index, 1);
        renderExperienceList();
        saveAndUpdate();
      });
    });
  }

  btnAddExp.addEventListener('click', () => {
    resumeData.experience.push({
      id: 'exp-' + Date.now(),
      role: '',
      company: '',
      duration: '',
      bullets: []
    });
    renderExperienceList();
    saveAndUpdate();
  });

  // Projects List
  function renderProjectsList() {
    projectContainer.innerHTML = '';
    resumeData.projects.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'saas-dynamic-card';
      card.innerHTML = `
        <button type="button" class="btn-saas-remove" data-index="${idx}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
        <div class="saas-form-group">
          <label class="saas-label">Project Title</label>
          <input type="text" class="saas-control proj-title" value="${proj.title || ''}" placeholder="Project Title" data-index="${idx}">
        </div>
        <div class="saas-form-grid">
          <div class="saas-form-group">
            <label class="saas-label">Role</label>
            <input type="text" class="saas-control proj-role" value="${proj.role || ''}" placeholder="Lead Developer" data-index="${idx}">
          </div>
          <div class="saas-form-group">
            <label class="saas-label">Duration</label>
            <input type="text" class="saas-control proj-duration" value="${proj.duration || ''}" placeholder="e.g. Mar 2024 - May 2024" data-index="${idx}">
          </div>
        </div>
        <div class="saas-form-group">
          <label class="saas-label">Description</label>
          <textarea class="saas-control proj-desc" placeholder="Details of technologies and deliverables..." data-index="${idx}">${proj.description || ''}</textarea>
        </div>
      `;
      projectContainer.appendChild(card);
    });

    projectContainer.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (e.target.classList.contains('proj-title')) {
          resumeData.projects[index].title = e.target.value;
        } else if (e.target.classList.contains('proj-role')) {
          resumeData.projects[index].role = e.target.value;
        } else if (e.target.classList.contains('proj-duration')) {
          resumeData.projects[index].duration = e.target.value;
        } else if (e.target.classList.contains('proj-desc')) {
          resumeData.projects[index].description = e.target.value;
        }
        saveAndUpdate();
      });
    });

    projectContainer.querySelectorAll('.btn-saas-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        resumeData.projects.splice(index, 1);
        renderProjectsList();
        saveAndUpdate();
      });
    });
  }

  btnAddProj.addEventListener('click', () => {
    resumeData.projects.push({
      id: 'proj-' + Date.now(),
      title: '',
      role: '',
      duration: '',
      description: ''
    });
    renderProjectsList();
    saveAndUpdate();
  });

  // Certifications List
  function renderCertificationsList() {
    certificationContainer.innerHTML = '';
    resumeData.certifications.forEach((cert, idx) => {
      const card = document.createElement('div');
      card.className = 'saas-dynamic-card';
      card.innerHTML = `
        <button type="button" class="btn-saas-remove" data-index="${idx}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
        <div class="saas-form-group">
          <label class="saas-label">Certification Title</label>
          <input type="text" class="saas-control cert-title" value="${cert.title || ''}" placeholder="e.g. AWS Certified Developer" data-index="${idx}">
        </div>
        <div class="saas-form-grid">
          <div class="saas-form-group">
            <label class="saas-label">Issuer</label>
            <input type="text" class="saas-control cert-issuer" value="${cert.issuer || ''}" placeholder="e.g. Amazon Web Services" data-index="${idx}">
          </div>
          <div class="saas-form-group">
            <label class="saas-label">Year</label>
            <input type="text" class="saas-control cert-date" value="${cert.date || ''}" placeholder="e.g. 2024" data-index="${idx}">
          </div>
        </div>
      `;
      certificationContainer.appendChild(card);
    });

    certificationContainer.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (e.target.classList.contains('cert-title')) {
          resumeData.certifications[index].title = e.target.value;
        } else if (e.target.classList.contains('cert-issuer')) {
          resumeData.certifications[index].issuer = e.target.value;
        } else if (e.target.classList.contains('cert-date')) {
          resumeData.certifications[index].date = e.target.value;
        }
        saveAndUpdate();
      });
    });

    certificationContainer.querySelectorAll('.btn-saas-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        resumeData.certifications.splice(index, 1);
        renderCertificationsList();
        saveAndUpdate();
      });
    });
  }

  btnAddCert.addEventListener('click', () => {
    resumeData.certifications.push({
      id: 'cert-' + Date.now(),
      title: '',
      issuer: '',
      date: ''
    });
    renderCertificationsList();
    saveAndUpdate();
  });


  // ==========================================
  // 6. FORM SYNC & STATE SAVING
  // ==========================================
  function populateFormFields() {
    const p = resumeData.personal || {};
    inputFullName.value = p.fullName || '';
    inputEmail.value = p.email || '';
    inputPhone.value = p.phone || '';
    inputLocation.value = p.location || '';
    inputLinkedin.value = p.linkedin || '';
    inputGithub.value = p.github || '';
    inputObjective.value = resumeData.objective || '';
    inputLanguages.value = resumeData.languages || '';
    inputAchievements.value = resumeData.achievements || '';

    // Sidebar text display
    if (sidebarNameDisplay) {
      sidebarNameDisplay.textContent = p.fullName || 'User Profile';
    }

    updatePhotoUploadUI();
    renderSkillsTags();
    renderEducationList();
    renderExperienceList();
    renderProjectsList();
    renderCertificationsList();
  }

  // Live input sync listeners
  const formTextfields = [
    { el: inputFullName, path: ['personal', 'fullName'] },
    { el: inputEmail, path: ['personal', 'email'] },
    { el: inputPhone, path: ['personal', 'phone'] },
    { el: inputLocation, path: ['personal', 'location'] },
    { el: inputLinkedin, path: ['personal', 'linkedin'] },
    { el: inputGithub, path: ['personal', 'github'] },
    { el: inputObjective, path: ['objective'] },
    { el: inputLanguages, path: ['languages'] },
    { el: inputAchievements, path: ['achievements'] }
  ];

  formTextfields.forEach(binding => {
    binding.el.addEventListener('input', (e) => {
      if (binding.path.length === 2) {
        resumeData[binding.path[0]][binding.path[1]] = e.target.value;
      } else {
        resumeData[binding.path[0]] = e.target.value;
      }
      
      // Update header profile display on name edit
      if (binding.el === inputFullName && sidebarNameDisplay) {
        sidebarNameDisplay.textContent = e.target.value || 'User Profile';
      }
      
      saveAndUpdate();
    });
  });

  function saveAndUpdate() {
    saveResumeData(resumeData);
    updatePreview();
    updateCompletionWidget();
    updateSectionIndicators();
  }

  function updatePreview() {
    const html = renderResume(resumeData);
    previewPaper.innerHTML = html;
  }

  // ==========================================
  // 7. WIDGETS: COMPLETION & SECTION DOTS
  // ==========================================
  function updateCompletionWidget() {
    let filledCount = 0;
    let totalFields = 10;
    const missing = [];

    const p = resumeData.personal || {};
    
    if (p.fullName && p.fullName.trim() !== '') filledCount++; else missing.push('Full Name');
    if (p.email && p.email.trim() !== '') filledCount++; else missing.push('Email');
    if (p.linkedin && p.linkedin.trim() !== '') filledCount++; else missing.push('LinkedIn');
    if (p.github && p.github.trim() !== '') filledCount++; else missing.push('GitHub');
    if (p.photoDataUrl && p.photoDataUrl.trim() !== '') filledCount++; else missing.push('Profile Photo');
    if (resumeData.objective && resumeData.objective.trim() !== '') filledCount++; else missing.push('Profile Objective');
    if (resumeData.skills && resumeData.skills.length > 0) filledCount++; else missing.push('Technical Skills');
    if (resumeData.education && resumeData.education.length > 0) filledCount++; else missing.push('Education');
    if (resumeData.experience && resumeData.experience.length > 0) filledCount++; else missing.push('Experience');
    if (resumeData.certifications && resumeData.certifications.length > 0) filledCount++; else missing.push('Certifications');

    const score = Math.round((filledCount / totalFields) * 100);
    
    // Update Widget DOM
    document.getElementById('completion-score-text').textContent = score + '%';
    document.getElementById('completion-progress-fill').style.width = score + '%';
    
    const missingContainer = document.getElementById('completion-missing-fields');
    if (missing.length > 0) {
      missingContainer.textContent = `Missing: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '...' : ''}`;
    } else {
      missingContainer.textContent = 'All core fields completed! ATS Ready.';
      missingContainer.style.color = 'var(--success)';
    }

    // Header progress bar update
    progressBar.style.width = score + '%';
  }

  function updateSectionIndicators() {
    const p = resumeData.personal || {};
    
    // Personal Info indicators
    const dotPersonal = document.getElementById('progress-indicator-personal');
    if (p.fullName && p.email && p.phone) {
      dotPersonal.classList.add('filled');
    } else {
      dotPersonal.classList.remove('filled');
    }

    // Objective indicator
    const dotObjective = document.getElementById('progress-indicator-objective');
    if (resumeData.objective && resumeData.objective.trim() !== '') {
      dotObjective.classList.add('filled');
    } else {
      dotObjective.classList.remove('filled');
    }

    // Skills indicator
    const dotSkills = document.getElementById('progress-indicator-skills');
    if (resumeData.skills && resumeData.skills.length >= 3) {
      dotSkills.classList.add('filled');
    } else {
      dotSkills.classList.remove('filled');
    }
  }


  // ==========================================
  // 8. ATS SCORE SIMULATOR
  // ==========================================
  function updateAtsPanel() {
    let score = 30; // base score for framework format

    const p = resumeData.personal || {};
    const suggestions = [];

    // Personal info check (30 pts max)
    if (p.fullName && p.fullName.trim() !== '') score += 5; else suggestions.push({ type: 'missing', text: 'Add your Full Name to increase keyword index visibility.' });
    if (p.email && p.email.trim() !== '') score += 5; else suggestions.push({ type: 'missing', text: 'Provide an Email address so parsing bots can parse contact details.' });
    if (p.phone && p.phone.trim() !== '') score += 5;
    if (p.location && p.location.trim() !== '') score += 5;
    if (p.linkedin && p.linkedin.trim() !== '') score += 5; else suggestions.push({ type: 'missing', text: 'Social profiles boost ATS rankings. Link your LinkedIn Profile URL.' });
    if (p.github && p.github.trim() !== '') score += 5; else suggestions.push({ type: 'missing', text: 'Add GitHub profile handle to satisfy tech screening triggers.' });

    // Objectives (10 pts)
    if (resumeData.objective && resumeData.objective.trim().length > 40) {
      score += 10;
    } else {
      suggestions.push({ type: 'missing', text: 'Write a comprehensive Summary containing engineering keywords (e.g. AWS, Full-Stack).' });
    }

    // Skills (20 pts)
    if (resumeData.skills.length >= 6) {
      score += 20;
    } else if (resumeData.skills.length >= 3) {
      score += 12;
      suggestions.push({ type: 'missing', text: 'Add at least 6 core technical keywords in Technical Expertise to clear filters.' });
    } else {
      suggestions.push({ type: 'missing', text: 'List technical expertise parameters. Empty skills cards trigger screening drops.' });
    }

    // Experience & Projects (30 pts max)
    if (resumeData.experience.length > 0) {
      score += 15;
      // check bullets
      let hasGoodBullets = true;
      resumeData.experience.forEach(exp => {
        if (!exp.bullets || exp.bullets.length < 2) hasGoodBullets = false;
      });
      if (!hasGoodBullets) {
        score -= 5;
        suggestions.push({ type: 'missing', text: 'List at least 2 duty bullet points per career experience card.' });
      }
    } else {
      suggestions.push({ type: 'missing', text: 'Missing Career History. Add developer internships or open-source activities.' });
    }

    if (resumeData.projects.length > 0) {
      score += 10;
    } else {
      suggestions.push({ type: 'missing', text: 'Add projects listings. Projects validate practical application scores.' });
    }

    // Certifications (10 pts)
    if (resumeData.certifications.length > 0) {
      score += 5;
    } else {
      suggestions.push({ type: 'missing', text: 'Include active certifications (e.g., AWS, Java, Scrum) to increase authority.' });
    }

    // Clean score clamp
    score = Math.min(score, 100);

    // Update Circle Ring
    const circle = document.getElementById('ats-score-circle');
    const scoreNum = document.getElementById('ats-score-num');
    
    scoreNum.textContent = score;
    
    // Circumference of r=70 circle is 2 * PI * 70 = 439.8 (approx 440)
    const strokeOffset = 440 - (score / 100) * 440;
    circle.style.strokeDashoffset = strokeOffset;

    // Strength classification
    let strength = 'Excellent';
    if (score < 45) strength = 'Poor';
    else if (score < 70) strength = 'Average';
    else if (score < 86) strength = 'Good';

    document.getElementById('ats-strength-val').textContent = strength;
    document.getElementById('ats-strength-fill').style.width = score + '%';

    // Populate dynamic suggestions
    const suggestionsList = document.getElementById('ats-suggestions-list');
    suggestionsList.innerHTML = '';
    
    if (suggestions.length === 0) {
      suggestionsList.innerHTML = `
        <div class="ats-suggestion-item check">
          <svg class="ats-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <div><b>Congratulations!</b> Your resume structure contains all ATS checklist items. Ready to submit to top tier pipelines.</div>
        </div>
      `;
    } else {
      suggestions.forEach(item => {
        const row = document.createElement('div');
        row.className = 'ats-suggestion-item missing';
        row.innerHTML = `
          <svg class="ats-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>${item.text}</div>
        `;
        suggestionsList.appendChild(row);
      });
    }
  }


  // ==========================================
  // 9. LAYOUT VIEW BLUEPRINTS BINDINGS
  // ==========================================
  function renderLayoutTab() {
    const cards = document.querySelectorAll('.blueprint-card');
    cards.forEach(card => {
      const templateId = card.getAttribute('data-template-id');
      
      if (templateId === resumeData.templateId) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }

      const selectBtn = card.querySelector('.btn-select-blueprint');
      selectBtn.onclick = () => {
        resumeData.templateId = templateId;
        saveAndUpdate();
        renderLayoutTab();
      };
    });
  }


  // ==========================================
  // 10. STYLES VIEW OPTIONS BINDINGS
  // ==========================================
  function initStylesTab() {
    // Colors preset circles
    colorPresetBtns.forEach(btn => {
      const colorHex = btn.getAttribute('data-color');
      
      if (colorHex === resumeData.styles.themeColor) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }

      btn.onclick = () => {
        resumeData.styles.themeColor = colorHex;
        saveAndUpdate();
        initStylesTab();
      };
    });

    // Fonts list
    fontPresetBtns.forEach(btn => {
      const font = btn.getAttribute('data-font');
      if (font === resumeData.styles.fontFamily) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }

      btn.onclick = () => {
        resumeData.styles.fontFamily = font;
        saveAndUpdate();
        initStylesTab();
      };
    });

    // Margins slider
    inputMargins.value = resumeData.styles.margins;
    labelMargins.textContent = `Layout Density: ${getMarginName(resumeData.styles.margins)} (${resumeData.styles.margins}px)`;
    inputMargins.oninput = (e) => {
      resumeData.styles.margins = e.target.value;
      labelMargins.textContent = `Layout Density: ${getMarginName(e.target.value)} (${e.target.value}px)`;
      saveAndUpdate();
    };

    // Mode toggles
    togglePhoto.checked = resumeData.styles.displayPhoto;
    togglePhoto.onchange = (e) => {
      resumeData.styles.displayPhoto = e.target.checked;
      saveAndUpdate();
    };

    toggleSkillsBg.checked = resumeData.styles.highlightSkillsBg;
    toggleSkillsBg.onchange = (e) => {
      resumeData.styles.highlightSkillsBg = e.target.checked;
      saveAndUpdate();
    };

    // Theme Switch Dark vs Light UI Modes
    const currentMode = document.body.getAttribute('data-theme') || 'dark';
    themeSwitchBtns.forEach(btn => {
      const mode = btn.getAttribute('data-mode');
      if (mode === currentMode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }

      btn.onclick = () => {
        document.body.setAttribute('data-theme', mode);
        themeSwitchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
    });
  }

  function getMarginName(val) {
    const num = parseInt(val);
    if (num < 17) return 'Compact';
    if (num > 25) return 'Spacious';
    return 'Normal';
  }


  // ==========================================
  // 11. PDF EXPORT HANDLERS
  // ==========================================
  function downloadPDF() {
    const originalBtnText = btnExportPdf.innerHTML;
    const originalHeaderBtnText = headerDownloadBtn.innerHTML;
    
    const loadingState = `
      <svg class="animate-spin" style="width:16px; height:16px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)"></circle>
        <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor"></path>
      </svg>
      Exporting...
    `;
    
    btnExportPdf.innerHTML = loadingState;
    headerDownloadBtn.innerHTML = loadingState;
    
    if (!document.getElementById('spin-keyframes')) {
      const style = document.createElement('style');
      style.id = 'spin-keyframes';
      style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    const opt = {
      margin: 0,
      filename: `${resumeData.personal.fullName || 'Resume'}_Saas_ResuMetric.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt)
      .from(previewPaper)
      .save()
      .then(() => {
        btnExportPdf.innerHTML = originalBtnText;
        headerDownloadBtn.innerHTML = originalHeaderBtnText;
      })
      .catch((err) => {
        console.error('PDF export failed:', err);
        btnExportPdf.innerHTML = originalBtnText;
        headerDownloadBtn.innerHTML = originalHeaderBtnText;
        window.print();
      });
  }

  btnExportPdf.addEventListener('click', downloadPDF);
  headerDownloadBtn.addEventListener('click', downloadPDF);


  // ==========================================
  // 12. INITIAL RUN
  // ==========================================
  populateFormFields();
  updatePreview();
  updateCompletionWidget();
  updateSectionIndicators();
  updateAtsPanel();

  // ==========================================
  // AJAX SAVE HANDLER
  // ==========================================
  const btnSaveResume = document.getElementById('btn-save-resume');
  if (btnSaveResume) {
    btnSaveResume.addEventListener('click', () => {
      const originalText = btnSaveResume.innerHTML;
      btnSaveResume.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 6px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style="opacity: 0.75;"></path>
        </svg>
        Saving...
      `;
      btnSaveResume.disabled = true;

      fetch('/resume/save/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': window.csrfToken || ''
        },
        body: JSON.stringify(resumeData)
      })
      .then(response => response.json())
      .then(data => {
        btnSaveResume.innerHTML = originalText;
        btnSaveResume.disabled = false;
        if (data.status === 'success') {
          // Store resume ID in the current resume data so subsequent saves update the same record!
          resumeData.resumeId = data.resume_id;
          if (window.initialResumeData) {
            window.initialResumeData.resumeId = data.resume_id;
          } else {
            window.initialResumeData = { resumeId: data.resume_id };
          }
          
          showToast('Resume saved successfully!', 'success');
          // If we are on a new resume path, let's redirect to edit URL to preserve URL state
          if (window.location.pathname.indexOf('/builder/') !== -1) {
            window.history.replaceState({}, '', `/resume/edit/${data.resume_id}/`);
          }
        } else {
          showToast('Failed to save: ' + (data.message || 'Unknown error'), 'error');
        }
      })
      .catch(err => {
        console.error('Save error:', err);
        btnSaveResume.innerHTML = originalText;
        btnSaveResume.disabled = false;
        showToast('Network error while saving.', 'error');
      });
    });
  }

  // Toast Helper
  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.position = 'fixed';
      container.style.bottom = '24px';
      container.style.right = '24px';
      container.style.zIndex = '9999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }

    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    const toast = document.createElement('div');
    toast.style.background = 'rgba(15, 23, 42, 0.95)';
    toast.style.backdropFilter = 'blur(12px)';
    toast.style.border = type === 'success' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)';
    toast.style.color = type === 'success' ? '#10B981' : '#EF4444';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '13px';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    const icon = type === 'success' 
      ? `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
      : `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Fade In
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 50);

    // Fade Out and Remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

});
