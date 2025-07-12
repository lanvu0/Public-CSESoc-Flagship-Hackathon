document.addEventListener('DOMContentLoaded', () => {
    const worksheet = document.getElementById('worksheet');
    let nextQuestionId = 1;

    // Make sidebar buttons draggable
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', btn.dataset.type);
        });
    });

    // Worksheet drop zone
    worksheet.addEventListener('dragover', (e) => {
        e.preventDefault();
        worksheet.style.backgroundColor = '#f0f4f8';
    });

    worksheet.addEventListener('dragleave', () => {
        worksheet.style.backgroundColor = '';
    });

    worksheet.addEventListener('drop', (e) => {
        e.preventDefault();
        worksheet.style.backgroundColor = '';
        
        const type = e.dataTransfer.getData('type');
        if (type === 'question') {
            addQuestion();
        }
        // Add other types (image, geogebra) here later
    });

    function addQuestion() {
        const questionId = nextQuestionId++;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.dataset.questionId = questionId;
        
        questionDiv.innerHTML = `
            <div class="question-header">
                <div class="question-title" contenteditable="true">Question ${questionId}</div>
            </div>
            <div class="question-toolbar">
                <button data-type="mcq">MCQ</button>
                <button data-type="short-answer">Short Answer</button>
                <button data-type="NULL">Custom...</button>
                <button class="delete-btn">Delete</button>
            </div>
            <div class="question-content">
                <div class="drop-zone">Drop content here</div>
            </div>
        `;
        
        // Add event listeners to question type buttons
        questionDiv.querySelectorAll('.question-toolbar button').forEach(btn => {
            if (btn.classList.contains('delete-btn')) {
                btn.addEventListener('click', () => {
                    questionDiv.remove();
                });
            } else {
                btn.addEventListener('click', () => {
                    setQuestionType(questionDiv, btn.dataset.type);
                });
            }
        });
        
        worksheet.appendChild(questionDiv);
    }

    function setQuestionType(questionDiv, type) {
        const contentArea = questionDiv.querySelector('.question-content');
        
        switch(type) {
            case 'mcq':
                contentArea.innerHTML = `
                    <div class="question-text" contenteditable="true">Multiple choice question</div>
                    <div class="mcq-options">
                        ${['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((opt, i) => `
                            <div class="mcq-option">
                                <input type="radio" name="q${questionDiv.dataset.questionId}" id="q${questionDiv.dataset.questionId}o${i}">
                                <label for="q${questionDiv.dataset.questionId}o${i}" contenteditable="true">${opt}</label>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'short-answer':
                contentArea.innerHTML = `
                    <div class="question-text" contenteditable="true">Question text</div>
                    <input type="text" class="input-answer" placeholder="Your answer">
                `;
                break;
        }
    }
});