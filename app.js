/**
 * EcoHub — E-Waste Academic Portfolio & Assignment Hub
 * Core Application Controller
 * Student: Sagar Rathod (24102A0067) • VIT Mumbai
 */

(function () {
  'use strict';

  // State Management
  const state = {
    assignments: window.ASSIGNMENTS_DATA || [],
    currentFilter: 'all',
    searchQuery: '',
    activeAssignment: null,
    activeResourceIndex: 0,
    currentSheet: null,
    currentSlideIndex: 0,
    theme: localStorage.getItem('ecohub-theme') || 'dark',
    isFullscreen: false
  };

  // SVG Icon Templates
  const ICONS = {
    database: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
    cpu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
    presentation: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20"></path><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path><path d="m7 21 5-5 5 5"></path></svg>`,
    flask: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path><path d="M8.5 2h7"></path><path d="M7 16h10"></path></svg>`,
    shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
    globe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    sparkles: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`,
    building: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>`,
    book: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    award: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
    filePdf: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    fileExcel: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13l3 4"></path><path d="M11 13l-3 4"></path><path d="M14 13h3v4h-3z"></path></svg>`,
    fileHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    fileImage: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
    externalLink: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
    download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
  };

  function getCategoryIcon(catIcon) {
    switch (catIcon) {
      case 'database': return ICONS.database;
      case 'cpu': return ICONS.cpu;
      case 'presentation': return ICONS.presentation;
      case 'flask-conical': return ICONS.flask;
      case 'shield-check': return ICONS.shield;
      case 'globe': return ICONS.globe;
      case 'sparkles': return ICONS.sparkles;
      case 'building-2': return ICONS.building;
      case 'book-open': return ICONS.book;
      case 'award': return ICONS.award;
      default: return ICONS.book;
    }
  }

  function getResourceIcon(type) {
    switch (type) {
      case 'pdf': return ICONS.filePdf;
      case 'excel': return ICONS.fileExcel;
      case 'html': return ICONS.fileHtml;
      case 'image': return ICONS.fileImage;
      case 'pptx': return ICONS.presentation;
      case 'link': return ICONS.externalLink;
      default: return ICONS.filePdf;
    }
  }

  // DOM Elements
  const gridContainer = document.getElementById('assignmentsGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const modalOverlay = document.getElementById('assignmentModal');
  const modalContainer = document.getElementById('modalContainer');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalFullscreenBtn = document.getElementById('modalFullscreenBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentCountSpan = document.getElementById('currentCount');

  // Initialize Application
  function init() {
    applyTheme(state.theme);
    renderGrid();
    setupEventListeners();
    handleHashNavigation();
  }

  // Theme Management
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    localStorage.setItem('ecohub-theme', theme);

    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }
  }

  // Render Assignment Grid Cards
  function renderGrid() {
    const filtered = state.assignments.filter(item => {
      const matchesCategory = state.currentFilter === 'all' || item.categorySlug === state.currentFilter;
      if (!state.searchQuery.trim()) return matchesCategory;

      const q = state.searchQuery.toLowerCase();
      const matchesSearch = 
        item.label.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q)) ||
        item.resources.some(r => r.name.toLowerCase().includes(q) || r.title.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });

    if (currentCountSpan) {
      currentCountSpan.textContent = filtered.length;
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No matching assignments found</h3>
          <p>Try searching with another keyword or selecting "All Submissions".</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(item => {
      const resourcePills = item.resources.map(res => `
        <span class="resource-pill" title="${res.title}">
          <span class="resource-pill-icon">${getResourceIcon(res.type)}</span>
          <span>${res.badge || res.type.toUpperCase()}</span>
        </span>
      `).join('');

      return `
        <article class="assignment-card" data-id="${item.id}" tabindex="0" role="button" aria-label="Open ${item.label}: ${item.title}">
          <div class="card-top-row">
            <span class="assignment-label-badge badge-${item.badgeType || 'primary'}">
              ${item.label}
            </span>
            <span class="card-category-tag">
              ${getCategoryIcon(item.icon)}
              ${item.category}
            </span>
          </div>

          <h3 class="card-title">${item.title}</h3>
          <p class="card-subtitle">${item.subtitle}</p>
          <p class="card-summary">${item.summary}</p>

          <div class="card-resources-row">
            ${resourcePills}
          </div>

          <div class="card-footer-row">
            <span class="card-date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${item.date}
            </span>
            <button class="btn-open-assignment" data-id="${item.id}">
              <span>Open Assignment</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach click events on cards
    gridContainer.querySelectorAll('.assignment-card').forEach(card => {
      card.addEventListener('click', () => {
        openAssignmentModal(card.dataset.id);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAssignmentModal(card.dataset.id);
        }
      });
    });
  }

  // Open Assignment Modal
  function openAssignmentModal(assignmentId, resourceIndex = 0) {
    const assignment = state.assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    state.activeAssignment = assignment;
    state.activeResourceIndex = resourceIndex;
    state.currentSlideIndex = 0;
    state.currentSheet = null;

    // Update Browser Hash for direct bookmarking
    window.location.hash = assignmentId;

    // Populate Modal Header
    document.getElementById('modalAssignmentLabel').className = `assignment-label-badge badge-${assignment.badgeType || 'primary'}`;
    document.getElementById('modalAssignmentLabel').textContent = assignment.label;
    document.getElementById('modalAssignmentTitle').textContent = assignment.title;
    document.getElementById('modalAssignmentCategory').textContent = `${assignment.category} • Sagar Rathod (24102A0067)`;

    // Render Resource Tabs
    renderModalResourceTabs();

    // Render Active Resource Content
    renderActiveResource();

    // Render Detailed Overview
    renderModalDetails();

    // Show Modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close Assignment Modal
  function closeAssignmentModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    state.activeAssignment = null;

    if (window.location.hash) {
      history.replaceState(null, null, ' ');
    }

    const iframe = document.getElementById('modalViewerIframe');
    if (iframe) iframe.src = 'about:blank';
  }

  // Render Resource Tabs inside Modal
  function renderModalResourceTabs() {
    const container = document.getElementById('modalResourceTabs');
    const assignment = state.activeAssignment;

    if (!assignment.resources || assignment.resources.length <= 1) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = assignment.resources.map((res, idx) => `
      <button class="modal-tab-btn ${idx === state.activeResourceIndex ? 'active' : ''}" data-index="${idx}">
        ${getResourceIcon(res.type)}
        <span>${res.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeResourceIndex = parseInt(btn.dataset.index, 10);
        state.currentSlideIndex = 0;
        state.currentSheet = null;
        renderModalResourceTabs();
        renderActiveResource();
      });
    });
  }

  // Render the currently selected resource (PDF, Excel, PPTX, Image, HTML, Link)
  function renderActiveResource() {
    const assignment = state.activeAssignment;
    const resource = assignment.resources[state.activeResourceIndex] || assignment.resources[0];
    const displayBox = document.getElementById('modalViewerDisplay');
    const quickBar = document.getElementById('modalQuickBar');

    // Populate Quick Launch Bar
    let quickActionsHtml = `
      <div class="quick-action-info">
        ${getResourceIcon(resource.type)}
        <span><strong>${resource.name}</strong> (${resource.badge || resource.type.toUpperCase()})</span>
      </div>
      <div class="quick-action-buttons">
    `;

    if (resource.type === 'link') {
      quickActionsHtml += `
        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="btn-action-primary">
          <span>Launch Live Website</span>
          ${ICONS.externalLink}
        </a>
      `;
    } else {
      const safePath = encodeURI(resource.path);
      const downloadPath = resource.downloadPath ? encodeURI(resource.downloadPath) : safePath;
      quickActionsHtml += `
        <a href="${safePath}" target="_blank" class="btn-action-primary">
          <span>Open in New Tab</span>
          ${ICONS.externalLink}
        </a>
        <a href="${downloadPath}" download class="btn-action-secondary">
          <span>Download File</span>
          ${ICONS.download}
        </a>
      `;
    }

    quickActionsHtml += `</div>`;
    quickBar.innerHTML = quickActionsHtml;

    const safeResourcePath = resource.path ? encodeURI(resource.path) : '';

    // Route to appropriate view renderer
    if (resource.type === 'link') {
      displayBox.innerHTML = `
        <div class="external-link-card">
          <div class="external-link-icon">${ICONS.globe}</div>
          <h3>${resource.title}</h3>
          <p>${resource.description}</p>
          <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="btn-action-primary" style="padding: 12px 24px; font-size: 1rem;">
            <span>Launch Live Portal</span>
            ${ICONS.externalLink}
          </a>
        </div>
      `;
    } else if (resource.type === 'excel') {
      renderExcelViewer(resource, displayBox);
    } else if (resource.type === 'pptx') {
      renderPptxViewer(resource, displayBox);
    } else if (resource.type === 'image') {
      renderImageViewer(resource, displayBox);
    } else if (resource.type === 'html') {
      displayBox.innerHTML = `
        <iframe src="${safeResourcePath}" class="viewer-iframe" title="${resource.title}" id="modalViewerIframe"></iframe>
      `;
    } else if (resource.type === 'pdf') {
      displayBox.innerHTML = `
        <iframe src="${safeResourcePath}#toolbar=1&navpanes=0" class="viewer-iframe" title="${resource.title}" id="modalViewerIframe">
          <p>Your browser does not support embedded PDFs. <a href="${safeResourcePath}" target="_blank">Click here to view PDF</a>.</p>
        </iframe>
      `;
    }
  }

  // Render Interactive Excel Spreadsheet Viewer
  function renderExcelViewer(resource, container) {
    const excelKey = resource.excelKey;
    const cache = window.EXCEL_CACHE && window.EXCEL_CACHE[excelKey];

    if (!cache) {
      container.innerHTML = `
        <div class="external-link-card">
          <div class="external-link-icon">${ICONS.fileExcel}</div>
          <h3>${resource.title}</h3>
          <p>${resource.description}</p>
          <a href="${resource.path}" download class="btn-action-primary">
            <span>Download & Open in Microsoft Excel</span>
            ${ICONS.download}
          </a>
        </div>
      `;
      return;
    }

    const sheetNames = Object.keys(cache);
    state.currentSheet = state.currentSheet && sheetNames.includes(state.currentSheet) ? state.currentSheet : sheetNames[0];

    container.innerHTML = `
      <div class="excel-viewer-container">
        <div class="excel-sheet-tabs-bar" id="excelSheetTabs">
          ${sheetNames.map(s => `
            <button class="excel-sheet-tab ${s === state.currentSheet ? 'active' : ''}" data-sheet="${s}">
              📊 ${s}
            </button>
          `).join('')}
        </div>
        <div class="excel-table-scroll" id="excelTableScroll">
          ${generateTableHtml(cache[state.currentSheet])}
        </div>
      </div>
    `;

    container.querySelectorAll('.excel-sheet-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        state.currentSheet = tab.dataset.sheet;
        renderExcelViewer(resource, container);
      });
    });
  }

  function generateTableHtml(sheetRows) {
    if (!sheetRows || sheetRows.length === 0) {
      return `<p style="padding: 24px; color: var(--text-secondary);">Sheet contains no displayable rows.</p>`;
    }

    const header = sheetRows[0];
    const dataRows = sheetRows.slice(1);

    return `
      <table class="excel-table">
        <thead>
          <tr>
            <th style="width: 44px; text-align: center;">#</th>
            ${header.map(cell => `<th>${escapeHtml(cell)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${dataRows.map((row, rIdx) => `
            <tr>
              <td style="color: var(--text-muted); text-align: center; font-size: 0.78rem;">${rIdx + 1}</td>
              ${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Render Interactive PPTX Presentation Slide Viewer
  function renderPptxViewer(resource, container) {
    const deckKey = resource.pptxKey;
    const deck = window.PPTX_CACHE && window.PPTX_CACHE[deckKey];

    if (!deck || !deck.slides || deck.slides.length === 0) {
      container.innerHTML = `
        <div class="external-link-card">
          <div class="external-link-icon">${ICONS.presentation}</div>
          <h3>${resource.title}</h3>
          <p>${resource.description}</p>
          <a href="${resource.path}" download class="btn-action-primary">
            <span>Download PowerPoint Presentation (.pptx)</span>
            ${ICONS.download}
          </a>
        </div>
      `;
      return;
    }

    const slides = deck.slides;
    const slide = slides[state.currentSlideIndex] || slides[0];

    container.innerHTML = `
      <div class="pptx-viewer-container">
        <!-- Presentation Top Navigation & Info Bar -->
        <div class="pptx-top-bar">
          <div class="pptx-deck-title">
            <span>📊 ${escapeHtml(deck.deckTitle)}</span>
          </div>
          <div class="pptx-slide-badge">
            Slide ${state.currentSlideIndex + 1} of ${slides.length}
          </div>
        </div>

        <!-- Slide Canvas Display -->
        <div class="pptx-slide-canvas">
          <div class="pptx-slide-header">
            <span class="pptx-slide-num-pill">Slide #${slide.slideNumber}</span>
            <h3 class="pptx-slide-title">${escapeHtml(slide.title)}</h3>
          </div>
          <div class="pptx-slide-bullets">
            ${slide.points && slide.points.length > 0 ? slide.points.map(p => `
              <div class="pptx-slide-bullet-item">
                <div class="pptx-bullet-dot"></div>
                <div class="pptx-bullet-text">${escapeHtml(p)}</div>
              </div>
            `).join('') : `
              <div class="pptx-slide-bullet-item">
                <div class="pptx-bullet-dot"></div>
                <div class="pptx-bullet-text">Detailed schematic and visual slide layout. Download PowerPoint file for complete multimedia layout.</div>
              </div>
            `}
          </div>
        </div>

        <!-- Slide Controls Bar -->
        <div class="pptx-controls-bar">
          <button class="pptx-nav-btn" id="pptxPrevBtn" ${state.currentSlideIndex === 0 ? 'disabled' : ''} title="Previous Slide (Left Arrow)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span>Previous</span>
          </button>
          
          <div class="pptx-dots-strip">
            ${slides.map((_, sIdx) => `
              <span class="pptx-dot ${sIdx === state.currentSlideIndex ? 'active' : ''}" data-index="${sIdx}" title="Jump to Slide ${sIdx + 1}"></span>
            `).join('')}
          </div>

          <button class="pptx-nav-btn" id="pptxNextBtn" ${state.currentSlideIndex === slides.length - 1 ? 'disabled' : ''} title="Next Slide (Right Arrow)">
            <span>Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    `;

    document.getElementById('pptxPrevBtn').addEventListener('click', () => {
      if (state.currentSlideIndex > 0) {
        state.currentSlideIndex--;
        renderPptxViewer(resource, container);
      }
    });

    document.getElementById('pptxNextBtn').addEventListener('click', () => {
      if (state.currentSlideIndex < slides.length - 1) {
        state.currentSlideIndex++;
        renderPptxViewer(resource, container);
      }
    });

    container.querySelectorAll('.pptx-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        state.currentSlideIndex = parseInt(dot.dataset.index, 10);
        renderPptxViewer(resource, container);
      });
    });
  }

  // Render Image Viewer with Lightbox & Zoom
  function renderImageViewer(resource, container) {
    container.innerHTML = `
      <div class="viewer-image-container">
        <a href="${resource.path}" target="_blank" title="Click to view full high-resolution image" class="viewer-image-link">
          <img src="${resource.path}" alt="${resource.title}" class="viewer-image-img" loading="lazy">
        </a>
        <div class="viewer-image-caption">
          <span>🔍 Click on image or use "Open in New Tab" to inspect at full native resolution</span>
        </div>
      </div>
    `;
  }

  // Render Detailed Assignment Info in Modal
  function renderModalDetails() {
    const assignment = state.activeAssignment;
    const highlightsContainer = document.getElementById('modalHighlightsList');
    const metaContainer = document.getElementById('modalMetaTable');
    const tagsContainer = document.getElementById('modalTagsCluster');

    highlightsContainer.innerHTML = assignment.highlights.map(h => `
      <li>
        ${ICONS.check}
        <span>${h}</span>
      </li>
    `).join('');

    metaContainer.innerHTML = `
      <div class="meta-info-row">
        <span class="meta-info-label">Student Name:</span>
        <span class="meta-info-val"><strong>Sagar Rathod</strong></span>
      </div>
      <div class="meta-info-row">
        <span class="meta-info-label">Roll Number:</span>
        <span class="meta-info-val"><strong>24102A0067</strong></span>
      </div>
      <div class="meta-info-row">
        <span class="meta-info-label">Academic Institution:</span>
        <span class="meta-info-val">Vidyalankar Institute of Technology, Mumbai</span>
      </div>
      <div class="meta-info-row">
        <span class="meta-info-label">Department / Branch:</span>
        <span class="meta-info-val">Department of Computer Engineering</span>
      </div>
      <div class="meta-info-row">
        <span class="meta-info-label">Subject:</span>
        <span class="meta-info-val">Electronic Waste Management (EWEM)</span>
      </div>
      <div class="meta-info-row">
        <span class="meta-info-label">Evaluation Status:</span>
        <span class="meta-info-val" style="color: var(--accent-mint); font-weight: 600;">${assignment.status}</span>
      </div>
      <div class="meta-info-row">
        <span class="meta-info-label">Academic Rating:</span>
        <span class="meta-info-val">${assignment.gradeScore}</span>
      </div>
      <div class="meta-info-row">
        <span class="meta-info-label">Reporting Date:</span>
        <span class="meta-info-val">${assignment.date}</span>
      </div>
    `;

    tagsContainer.innerHTML = assignment.tags.map(t => `<span class="tag-badge">#${t}</span>`).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Handle URL Hash Navigation (e.g. #ass-1, #ass-8)
  function handleHashNavigation() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {
      const match = state.assignments.find(a => a.id === hash);
      if (match) {
        setTimeout(() => openAssignmentModal(match.id), 100);
      }
    }
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Search Input
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderGrid();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
      renderGrid();
    });

    // Category Tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.currentFilter = tab.dataset.filter;
        renderGrid();
      });
    });

    // Theme Switcher
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    }

    // Modal Close
    modalCloseBtn.addEventListener('click', closeAssignmentModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeAssignmentModal();
    });

    // Modal Fullscreen
    modalFullscreenBtn.addEventListener('click', () => {
      state.isFullscreen = !state.isFullscreen;
      modalContainer.classList.toggle('fullscreen', state.isFullscreen);
      modalFullscreenBtn.innerHTML = state.isFullscreen 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="10" y1="14" x2="3" y2="21"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`;
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeAssignmentModal();
      }
      if (e.key === 'ArrowLeft' && modalOverlay.classList.contains('active')) {
        const prevBtn = document.getElementById('pptxPrevBtn');
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
      }
      if (e.key === 'ArrowRight' && modalOverlay.classList.contains('active')) {
        const nextBtn = document.getElementById('pptxNextBtn');
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
      }
    });

    // Hash change event
    window.addEventListener('hashchange', handleHashNavigation);
  }

  // Expose to window for direct triggers
  window.openAssignment = openAssignmentModal;

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
