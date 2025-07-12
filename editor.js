document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const toolBtns = document.querySelectorAll('.tool-btn');
    const formatBtns = document.querySelectorAll('.format-btn');
    const worksheetEditor = document.querySelector('.worksheet-editor');
    const addQuestionBtn = document.querySelector('.add-question-btn');
    const aiGenerateBtn = document.querySelector('.ai-generate-btn');
    const aiHelpBtn = document.querySelector('.ai-help-btn');
    const questionBlocks = document.querySelectorAll('.question-block');
    
    // Set up tool buttons
    toolBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toolBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, this would switch between different editors
            console.log(`Switched to ${this.textContent.trim()} mode`);
        });
    });
    
    // Set up format buttons
    formatBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            formatBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apply selected style to content
            const style = this.dataset.style;
            worksheetEditor.className = `worksheet-editor ${style}-style`;
            
            console.log(`Applied ${style} formatting style`);
        });
    });

    // Delete question functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-question')) {
                const questionBlock = e.target.closest('.question-block');
                if (questionBlock && confirm('Are you sure you want to delete this question?')) {
                questionBlock.remove();
                updateQuestionNumbers(); // Update numbering after deletion
                }
        }
    });


    // Function to update question numbers after deletion
    function updateQuestionNumbers() {
        document.querySelectorAll('.question-block').forEach((block, index) => {
                const numberElement = block.querySelector('.question-number');
                if (numberElement) {
                numberElement.textContent = `${index + 1}.`;
                }
        });
    }

    // Add new question
    addQuestionBtn.addEventListener('click', function() {
        const newQuestion = document.createElement('div');
        newQuestion.className = 'question-block editable';
        newQuestion.contentEditable = 'false';
        
        const questionCount = document.querySelectorAll('.question-block').length + 1;
        
        newQuestion.innerHTML = `
            <div class="question-header">
                <span class="question-number">${questionCount}.</span>
                <div class="question-tools">
                    <i class="fas fa-trash delete-question" title="Delete question"></i>
                    <i class="fas fa-image" title="Add image"></i>
                    <i class="fas fa-function" title="Add equation"></i>
                    <i class="fas fa-table" title="Add table"></i
                </div>
            </div>
            <div class="question-content">
                [Click to edit question]
            </div>
            <div class="answer-space">
                <span>Answer: _______________</span>
            </div>
        `;
        
        document.querySelector('.worksheet-content').insertBefore(
            newQuestion,
            document.querySelector('.add-question')
        );
        
        // Focus on the new question content
        newQuestion.querySelector('.question-content').focus();
    
        // Update the question numbers
        updateQuestionNumbers();
    });
    
    // AI Generate similar question
    aiGenerateBtn.addEventListener('click', function() {
        // In a real app, this would call an AI service
        alert('AI would generate a similar question based on the selected question');
    });
    
    // AI Help button
    aiHelpBtn.addEventListener('click', function() {
        const prompt = document.querySelector('.ai-prompt input').value;
        if (prompt.trim() === '') return;
        
        // In a real app, this would call an AI service
        alert(`AI would help with: "${prompt}"\n\nThis could generate questions, worksheets, or teaching suggestions based on the input.`);
    });
    
    // Make question blocks editable
    questionBlocks.forEach(block => {
        block.addEventListener('focus', function() {
            this.style.backgroundColor = 'white';
            this.style.boxShadow = '0 0 0 2px var(--primary-light)';
        });
        
        block.addEventListener('blur', function() {
            this.style.backgroundColor = '#fafafa';
            this.style.boxShadow = 'none';
        });
    });
    
    // Mobile menu toggle (would be implemented in a real app)
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(mobileMenuToggle);
    
    mobileMenuToggle.addEventListener('click', function() {
        document.querySelector('.side-tab').classList.toggle('active');
    });
});
