document.addEventListener('DOMContentLoaded', function() {
    const addQuestionBtn = document.querySelector('.add-question-btn');
    const questionManager = document.querySelector('.question-manager');

    // Function to create a new question block
    function createNewQuestion() {
        const questionBlock = document.createElement('div');
        questionBlock.classList.add('question-block');
    
        const questionCount = document.querySelectorAll('.question-block').length + 1;

        questionBlock.innerHTML = `
            <label class="question-number">${questionCount}.</label>
            <div class="question-content" contenteditable="true">[Click to edit question]</div>
            <div class="answer-label">Answer:</div>
            <div class="answer-space">
                <span class="answer-line" contenteditable="true"></span>
            </div>
            <div class="question-tools">
                <i class="fas fa-trash delete-question" title="Delete question"></i>
                <i class="fas fa-image" title="Add image"></i>
                <i class="fas fa-function" title="Add equation">+</i>
                <i class="fas fa-table" title="Add table"></i>
            </div>
        `;

        // Attach event listener for deleting questions
        questionBlock.querySelector('.delete-question').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this question?')) {
                questionBlock.remove();
                updateQuestionNumbers();
            }
        });

        // Add the new question to the question manager
        questionManager.appendChild(questionBlock);
        updateQuestionNumbers();
    }


    // Function to update the question numbers
    function updateQuestionNumbers() {
        const questionBlocks = document.querySelectorAll('.question-block');
        questionBlocks.forEach((block, index) => {
            const questionNumber = block.querySelector('.question-number');
            if (questionNumber) {
                questionNumber.textContent = `${index + 1}.`;
            }
        });
    }

    // Add event listener to the 'Add Question' button
    addQuestionBtn.addEventListener('click', createNewQuestion);
});
