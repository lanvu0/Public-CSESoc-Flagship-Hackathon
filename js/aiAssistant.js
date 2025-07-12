document.addEventListener('DOMContentLoaded', function() {
    const aiHelpBtn = document.querySelector('.ai-help-btn');
    const aiInput = document.querySelector('.ai-prompt input');

    aiHelpBtn.addEventListener('click', function() {
        const prompt = aiInput.value.trim();

        if (prompt === '') return;

        // Placeholder for AI functionality (e.g., calling an AI API)
        alert(`AI would help with: "${prompt}"\n\nThis could generate questions, worksheets, or teaching suggestions based on the input.`);
    });
});
