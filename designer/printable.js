document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const problemsList = document.getElementById('problems-list');
    const problemTemplate = document.getElementById('problem-template');
    const problemInserter = document.querySelector('.problem-inserter');
    const worksheet = document.getElementById('worksheet');
    const worksheetTitle = worksheet.querySelector('h1');
    const worksheetInstructions = worksheet.querySelector('.worksheet-instructions');

    // --- Template Data (unchanged) ---
    const templates = {
        basic: {
            title: "Mathematics Worksheet",
            instructions: "Solve the following problems in the space provided. Show your work.",
            problems: [
                "Solve for x: 2x + 5 = 15",
                "Calculate the area of a circle with radius 5cm.",
                "Simplify the expression: (4 + 5) * 3."
            ]
        },
        exam: {
            title: "End of Term Exam",
            instructions: "Answer all questions to the best of your ability. Partial credit will be awarded for showing your work. This exam is out of 50 points.",
            problems: [
                "If a car travels at 60 km/h, how far will it travel in 2.5 hours?",
                "Find the value of 'y' in the equation: 4y - 7 = 21.",
                "What is the Pythagorean theorem? Provide the formula and a brief explanation.",
                "Calculate the volume of a cylinder with a radius of 3cm and a height of 10cm."
            ]
        }
    };
    
    // =================================================================
    // --- ALL CORE FUNCTIONS, TEMPLATE LOADING, VIEW TOGGLING, and DRAG/DROP ---
    // --- LOGIC REMAINS IDENTICAL TO THE PREVIOUS VERSION.           ---
    // =================================================================
    function createNewProblem(text = '', answer = '', insertAfterElement = null) {
        const newProblem = problemTemplate.content.cloneNode(true).firstElementChild;
        newProblem.querySelector('.editable').textContent = text;
        newProblem.querySelector('.answer-key-content').textContent = answer;
        if (insertAfterElement) {
            insertAfterElement.after(newProblem);
        } else {
            problemsList.appendChild(newProblem);
        }
        addEventListenersToProblem(newProblem);
        return newProblem;
    }
    function updateProblemNumbers() {
        const allProblems = problemsList.querySelectorAll('.problem');
        allProblems.forEach((problem, index) => {
            problem.querySelector('.problem-number').textContent = `${index + 1}.`;
        });
    }
    function addEventListenersToProblem(problem) {
        problem.querySelector('.delete-problem-btn').addEventListener('click', () => {
            problem.remove();
            updateProblemNumbers();
        });
        problem.addEventListener('dragstart', handleDragStart);
        problem.addEventListener('dragend', handleDragEnd);
    }
    function loadTemplate(templateName) {
        const template = templates[templateName];
        if (!template) return;
        problemsList.innerHTML = '';
        worksheetTitle.textContent = template.title;
        worksheetInstructions.textContent = template.instructions;
        template.problems.forEach(problemText => createNewProblem(problemText));
        updateProblemNumbers();
    }
    const templateItems = document.querySelectorAll('.templates-list li');
    templateItems.forEach(item => {
        item.addEventListener('click', function() {
            templateItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const templateName = this.getAttribute('data-template');
            loadTemplate(templateName);
        });
    });
    const worksheetBtn = document.getElementById('view-worksheet-btn');
    const answerKeyBtn = document.getElementById('view-answer-key-btn');
    worksheetBtn.addEventListener('click', () => {
        worksheet.classList.remove('answer-key-view');
        worksheetBtn.classList.add('active');
        answerKeyBtn.classList.remove('active');
    });
    answerKeyBtn.addEventListener('click', () => {
        worksheet.classList.add('answer-key-view');
        answerKeyBtn.classList.add('active');
        worksheetBtn.classList.remove('active');
    });
    problemInserter.querySelector('.inserter-btn').addEventListener('click', () => {
        const insertAfterId = problemInserter.dataset.insertAfter;
        const insertAfterElement = insertAfterId ? document.getElementById(insertAfterId) : null;
        createNewProblem('', '', insertAfterElement);
        updateProblemNumbers();
    });
    worksheet.addEventListener('mouseover', e => {
        const targetProblem = e.target.closest('.problem');
        if (targetProblem) {
            const rect = targetProblem.getBoundingClientRect();
            const worksheetRect = worksheet.getBoundingClientRect();
            problemInserter.style.top = `${rect.bottom - worksheetRect.top - (problemInserter.offsetHeight / 2)}px`;
            problemInserter.classList.add('visible');
            targetProblem.id = targetProblem.id || `problem-${Date.now()}`;
            problemInserter.dataset.insertAfter = targetProblem.id;
        }
    });
    worksheet.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget || (!e.relatedTarget.closest('#problems-list') && !e.relatedTarget.closest('.problem-inserter'))) {
            problemInserter.classList.remove('visible');
        }
    });
    let draggedItem = null;
    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => { this.classList.add('is-dragging'); }, 0);
    }
    function handleDragEnd() {
        this.classList.remove('is-dragging');
        draggedItem = null;
        const dropTarget = document.querySelector('.drop-target');
        if (dropTarget) dropTarget.classList.remove('drop-target');
        updateProblemNumbers();
    }
    problemsList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(problemsList, e.clientY);
        problemsList.querySelectorAll('.drop-target').forEach(p => p.classList.remove('drop-target'));
        if (afterElement == null) {
            problemsList.appendChild(draggedItem);
        } else {
            problemsList.insertBefore(draggedItem, afterElement);
            afterElement.classList.add('drop-target');
        }
    });
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.problem:not(.is-dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else { return closest; }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // =================================================================
    // --- NEW: PDF EXPORT FUNCTIONALITY ---
    // =================================================================

    const exportPdfBtn = document.getElementById('export-pdf-btn');
    
    async function handlePdfExport() {
        const { jsPDF } = window.jspdf;
        const worksheetElement = document.getElementById('worksheet');
        
        // Temporarily remove box-shadow for cleaner capture
        const originalShadow = worksheetElement.style.boxShadow;
        worksheetElement.style.boxShadow = 'none';

        // Add loading state to button
        exportPdfBtn.disabled = true;
        exportPdfBtn.classList.add('loading');
        // We split the content into icon and text spans to hide them individually
        exportPdfBtn.innerHTML = `<span class="btn-icon"><i class="fas fa-file-pdf"></i></span><span class="btn-text">Download PDF</span>`;

        try {
            // Use html2canvas to capture the worksheet as a canvas
            const canvas = await html2canvas(worksheetElement, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                onclone: (document) => {
                    // Hide elements that shouldn't be in the PDF, like the inserter
                    const inserter = document.querySelector('.problem-inserter');
                    if(inserter) inserter.style.display = 'none';
                }
            });

            const imgData = canvas.toDataURL('image/png');

            // Define A4 paper dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;
            let finalImgWidth = pdfWidth;
            let finalImgHeight = pdfWidth / ratio;
            
            // Handle case where content is taller than it is wide
            if (finalImgHeight > pdfHeight) {
                finalImgHeight = pdfHeight;
                finalImgWidth = pdfHeight * ratio;
            }

            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            doc.addImage(imgData, 'PNG', 0, 0, finalImgWidth, finalImgHeight);
            
            // Use the worksheet title for the filename
            const fileName = `${worksheetTitle.textContent.trim().replace(/ /g, '_') || 'EduCreate_Worksheet'}.pdf`;
            doc.save(fileName);

        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Sorry, there was an error creating the PDF. Please try again.");
        } finally {
            // Restore original state
            worksheetElement.style.boxShadow = originalShadow;
            exportPdfBtn.disabled = false;
            exportPdfBtn.classList.remove('loading');
            exportPdfBtn.innerHTML = `<i class="fas fa-file-pdf"></i> Download PDF`;
        }
    }

    exportPdfBtn.addEventListener('click', handlePdfExport);

    // Initialize with the basic template on page load
    loadTemplate('basic');
});