document.addEventListener('DOMContentLoaded', function() {
    // Load questions from previous stage (simulated)
    const questions = [
        { id: 1, content: "Solve for x: 2x + 5 = 15" },
        { id: 2, content: "Calculate the area of a circle with radius 5cm" },
        { id: 3, content: "Simplify the expression: 3(x + 4) - 2x" }
    ];

    // Check if we're on digital or printable page
    const isDigital = document.querySelector('.digital-answer') !== null;
    const questionsContainer = document.getElementById('questions-container');

    // Render questions
    function renderQuestions() {
        questionsContainer.innerHTML = '';
        
        questions.forEach((question, index) => {
            const questionEl = document.createElement('div');
            questionEl.className = 'question-item';
            questionEl.innerHTML = `
                <div class="question-text">
                    <strong>${index + 1}.</strong> ${question.content}
                </div>
                <div class="answer-input">
                    Answer: ${isDigital ? 
                        `<input type="text" class="digital-answer" placeholder="Type your answer">` : 
                        `<span class="printable-answer">_______________</span>`}
                </div>
            `;
            questionsContainer.appendChild(questionEl);
        });
    }

    // Template selection
    const templates = document.querySelectorAll('.template');
    templates.forEach(template => {
        template.addEventListener('click', function() {
            templates.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize
    renderQuestions();
});