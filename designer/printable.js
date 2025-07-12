document.addEventListener('DOMContentLoaded', function() {
    // Template data
    const templates = {
        basic: {
            title: "Mathematics Worksheet",
            problems: [
                "Solve for x: 2x + 5 = 15",
                "Calculate the area of a circle with radius 5cm",
                "Simplify the expression: 49 - 26"
            ],
            showExamSection: false
        },
        exam: {
            title: "Mathematics Exam",
            problems: [
                "Multiple choice: What is 2+2? A) 3 B) 4 C) 5",
                "Solve the equation: 3x + 5 = 20",
                "Calculate the area of a triangle with base 4 and height 5"
            ],
            showExamSection: true,
            examSectionContent: [
                "Answer all questions in the space provided",
                "Show all your work for partial credit"
            ]
        }
    };
    
    // Template selection
    const templateItems = document.querySelectorAll('.templates-list li');
    templateItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            templateItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Load the selected template
            const templateName = this.getAttribute('data-template');
            loadTemplate(templateName);
        });
    });
    
    // Load template function
    function loadTemplate(templateName) {
        const template = templates[templateName];
        
        // Update title
        document.querySelector('.worksheet h1').textContent = template.title;
        
        // Update problems
        const problems = document.querySelectorAll('.problem');
        problems.forEach((problem, index) => {
            const problemText = problem.querySelector('.editable');
            if (template.problems[index]) {
                problemText.textContent = template.problems[index];
            }
        });
        
        // Update exam section
        const examSection = document.getElementById('exam-section');
        const examSectionContent = examSection.querySelectorAll('.editable');
        
        if (template.showExamSection) {
            examSection.style.display = 'block';
            document.getElementById('divider').style.display = 'block';
            examSectionContent.forEach((p, index) => {
                if (template.examSectionContent[index]) {
                    p.textContent = template.examSectionContent[index];
                }
            });
        } else {
            examSection.style.display = 'none';
            document.getElementById('divider').style.display = 'none';
        }
    }
    
    // Initialize with basic template
    loadTemplate('basic');
    
    // Add problem functionality
    const addProblemBtn = document.getElementById('add-problem');
    addProblemBtn.addEventListener('click', function() {
        const problemContainer = document.getElementById('worksheet');
        const problems = document.querySelectorAll('.problem');
        const newProblemNumber = problems.length + 1;
        
        const newProblem = document.createElement('div');
        newProblem.className = 'problem';
        newProblem.innerHTML = `
            <div>
                <span class="problem-number">${newProblemNumber}.</span>
                <span contenteditable="true" class="editable">Enter your math problem here</span>
            </div>
            <div class="answer-space"></div>
        `;
        
        // Insert before the divider
        const divider = document.getElementById('divider');
        problemContainer.insertBefore(newProblem, divider);
    });
    
    // Print functionality
    const printBtn = document.getElementById('print-btn');
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Focus on first editable element
    document.querySelector('.editable').focus();
});
