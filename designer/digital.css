document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const canvasArea = document.getElementById('canvas-area');
    const inspector = document.getElementById('inspector');
    // NOTE: The 'element-inserter' element from the previous version is not in the provided HTML.
    // I will remove references to it to avoid errors and stick to the original HTML provided in this request.
    const aiFab = document.getElementById('ai-fab');
    const aiModalOverlay = document.getElementById('ai-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const aiGenerateBtn = document.getElementById('ai-generate-btn');

    let elementCounter = 0;
    let selectedElement = null;
    let draggedElement = null;

    // =================================================================
    // --- NEW: AI INTEGRATION LOGIC ---
    // =================================================================

    // --- STEP 1: ADD YOUR API KEY HERE ---
    // This is for demonstration only. In a real app, this key should be on a secure server.
    const OPENAI_API_KEY = 'sk-YOUR_API_KEY_HERE'; // <-- IMPORTANT: REPLACE WITH YOUR ACTUAL KEY

    const aiGenerateBtnIcon = aiGenerateBtn.querySelector('i');
    const aiGenerateBtnText = ' Generate';

    async function handleAiGeneration() {
        const prompt = document.getElementById('ai-prompt-input').value;
        if (prompt.trim() === '' || OPENAI_API_KEY === 'sk-YOUR_API_KEY_HERE') {
            alert('Please enter a prompt and add your OpenAI API key to app.js');
            return;
        }

        // --- STEP 2: UPDATE UI TO SHOW LOADING STATE ---
        aiGenerateBtn.disabled = true;
        aiGenerateBtnIcon.className = 'fas fa-spinner fa-spin';
        aiGenerateBtn.childNodes[1].textContent = ' Generating...';

        // --- STEP 3: DEFINE THE "SYSTEM PROMPT" ---
        // This is the most crucial part. We instruct the AI on its role and
        // demand that it responds ONLY in a specific JSON format.
        const systemPrompt = `
You are an expert content creation assistant for an educational app called Synapse.
Your task is to generate a series of content blocks based on the user's prompt.
You MUST respond with ONLY a valid JSON object. Do not include any other text, explanation, or markdown formatting.
The JSON object must have a single root key called "elements".
The "elements" key must contain an array of objects.
Each object in the array represents a content block and must have two keys: "type" and "content".

Supported "type" values are:
- "text": For a question, explanation, or paragraph.
- "mcq": For a multiple-choice question.

The "content" object for each type must be:
- For "text": { "title": "A short title or question", "body": "The main text content." }
- For "mcq": { "title": "The multiple-choice question", "body": "Optional: extra context for the question.", "options": ["Option A", "Option B", "Option C", "Option D"] }

Example user prompt: "Create a simple question about photosynthesis and a 3-option MCQ about the solar system."
Example VALID response:
{
  "elements": [
    {
      "type": "text",
      "content": {
        "title": "The Process of Photosynthesis",
        "body": "What are the primary inputs required for photosynthesis to occur in plants?"
      }
    },
    {
      "type": "mcq",
      "content": {
        "title": "Largest Planet",
        "body": "Which of the following is the largest planet in our solar system?",
        "options": ["Earth", "Mars", "Jupiter"]
      }
    }
  ]
}
`;
        try {
            // --- STEP 4: MAKE THE API CALL TO OPENAI ---
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo-1106', // This model is good at following JSON instructions
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    response_format: { type: "json_object" } // Enforce JSON output
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.statusText} - ${errorData.error.message}`);
            }

            const data = await response.json();
            const responseContent = data.choices[0].message.content;

            // --- STEP 5: PARSE THE RESPONSE AND CREATE ELEMENTS ---
            const generatedData = JSON.parse(responseContent);

            if (generatedData.elements && Array.isArray(generatedData.elements)) {
                generatedData.elements.forEach(elementData => {
                    // Re-use the existing createElement function
                    if(elementData.type && elementData.content) {
                       createElement(elementData.type, elementData.content, null);
                    }
                });
            }

            aiModalOverlay.classList.remove('visible'); // Close modal on success
            document.getElementById('ai-prompt-input').value = ''; // Clear input

        } catch (error) {
            console.error('AI Generation Failed:', error);
            alert('An error occurred while generating content. Please check the console for details.');
        } finally {
            // --- STEP 6: RESET THE BUTTON, REGARDLESS OF OUTCOME ---
            aiGenerateBtn.disabled = false;
            aiGenerateBtnIcon.className = 'fas fa-wand-magic-sparkles';
            aiGenerateBtn.childNodes[1].textContent = aiGenerateBtnText;
        }
    }

    // Connect the handler to the button
    aiGenerateBtn.addEventListener('click', handleAiGeneration);


    // =================================================================
    // --- ALL CODE BELOW THIS LINE IS UNCHANGED FROM YOUR ORIGINAL ---
    // =================================================================

    // 1. Listen for drag starting from the tools palette
    document.querySelectorAll('.tool-item').forEach(tool => {
        tool.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', tool.dataset.type);
            e.dataTransfer.setData('source', 'palette');
            e.dataTransfer.effectAllowed = 'copy';
        });
    });

    // 2. Listen for drag starting from an existing canvas element (for re-ordering)
    canvasArea.addEventListener('dragstart', (e) => {
        const target = e.target.closest('.canvas-element');
        if (target) {
            draggedElement = target;
            e.dataTransfer.setData('source', 'canvas');
            e.dataTransfer.setData('elementId', target.dataset.id);
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => {
                target.classList.add('dragging');
            }, 0);
        }
    });

    // 3. This function is the heart of the logic. It determines the element to drop BEFORE.
    function getDropTarget(y) {
        const elements = [...canvasArea.querySelectorAll('.canvas-element:not(.dragging)')];
        return elements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // 4. Handle visual feedback as the user drags over the canvas
    canvasArea.addEventListener('dragover', (e) => {
        e.preventDefault();

        // Find the element that our dragged item should be inserted BEFORE
        const elementToDropBefore = getDropTarget(e.clientY);

        // Get a direct reference to the element that currently has a hint
        const currentHintedElement = document.querySelector('.drop-hint-above, .drop-hint-below');

        if (elementToDropBefore) {
            const elementAboveDrop = elementToDropBefore.previousElementSibling;

            if (elementAboveDrop && !elementAboveDrop.classList.contains('dragging')) {
                if (currentHintedElement !== elementAboveDrop) {
                    if (currentHintedElement) currentHintedElement.classList.remove('drop-hint-above', 'drop-hint-below');
                    elementAboveDrop.classList.add('drop-hint-below');
                }
            } else {
                if (currentHintedElement !== elementToDropBefore) {
                    if (currentHintedElement) currentHintedElement.classList.remove('drop-hint-above', 'drop-hint-below');
                    elementToDropBefore.classList.add('drop-hint-above');
                }
            }
        } else {
            const lastElement = canvasArea.querySelector('.canvas-element:not(.dragging):last-of-type');
            if (lastElement) {
                if (currentHintedElement !== lastElement) {
                    if (currentHintedElement) currentHintedElement.classList.remove('drop-hint-above', 'drop-hint-below');
                    lastElement.classList.add('drop-hint-below');
                }
            } else {
                 if (currentHintedElement) currentHintedElement.classList.remove('drop-hint-above', 'drop-hint-below');
                 canvasArea.classList.add('drop-active');
            }
        }
    });

    // 5. Clean up visual feedback when the drag leaves the canvas area
    canvasArea.addEventListener('dragleave', (e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;

        const allElements = [...canvasArea.querySelectorAll('.canvas-element')];
        allElements.forEach(el => {
            el.classList.remove('drop-hint-above', 'drop-hint-below');
        });
        canvasArea.classList.remove('drop-active');
    });

    // 6. Handle the actual drop action
    canvasArea.addEventListener('drop', (e) => {
        e.preventDefault();

        const dropTarget = getDropTarget(e.clientY);
        const source = e.dataTransfer.getData('source');

        if (source === 'palette') {
            const type = e.dataTransfer.getData('type');
            if (!type) return;
            createElement(type, {}, dropTarget);
        } else if (source === 'canvas') {
            if (!draggedElement) return;
            canvasArea.insertBefore(draggedElement, dropTarget);
        }

        const allElements = [...canvasArea.querySelectorAll('.canvas-element')];
        allElements.forEach(el => {
            el.classList.remove('drop-hint-above', 'drop-hint-below');
        });
         canvasArea.classList.remove('drop-active');
    });

    // 7. A final cleanup listener for when the drag ends
    document.addEventListener('dragend', () => {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement = null;
        }
    });

    function createElement(type, content = {}, insertBeforeElement = null) {
        elementCounter++;
        const elementWrapper = document.createElement('div');
        elementWrapper.className = 'canvas-element';
        elementWrapper.dataset.id = elementCounter;
        elementWrapper.dataset.type = type;
        elementWrapper.setAttribute('draggable', 'true');

        let innerHTML = `<button class="element-delete-btn" title="Delete Element"><i class="fas fa-trash-alt"></i></button>`;
        switch (type) {
            case 'text': innerHTML += `<div class="element-header" contenteditable="true" placeholder="Question Title...">${content.title || ''}</div><div class="element-content" contenteditable="true" placeholder="Type your question content here...">${content.body || ''}</div><input type="text" class="element-answer-input" placeholder="Student types answer here..."><div class="element-answer-line">Answer: </div>`; break;
            case 'mcq': const options = content.options || ['Option A', 'Option B', 'Option C']; innerHTML += `<div class="element-header" contenteditable="true" placeholder="MCQ Title...">${content.title || ''}</div><div class="element-content" contenteditable="true" placeholder="What is this question about?">${content.body || ''}</div><div class="mcq-options">${options.map((opt, i) => `<div class="mcq-option"><input type="radio" name="q${elementCounter}" id="q${elementCounter}o${i}"><label for="q${elementCounter}o${i}" contenteditable="true">${opt}</label></div>`).join('')}</div>`; break;
            case 'image': innerHTML += `<div class="element-content"><div class="image-placeholder"><i class="fas fa-image"></i><p>Click to upload image</p></div></div>`; break;
            case 'latex': innerHTML += `<div class="element-header" contenteditable="true" placeholder="Equation Title...">${content.title || ''}</div><div class="element-content" contenteditable="true" placeholder="\\sum_{i=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}">${content.body || ''}</div>`; break;
            case 'code': innerHTML += `<div class="element-header" contenteditable="true" placeholder="Code Block Title...">${content.title || ''}</div><pre><code class="language-js" contenteditable="true" placeholder="console.log('Hello, Synapse!');">${content.body || ''}</code></pre>`; break;
            default: innerHTML += `<div class="element-content" contenteditable="true">New Element</div>`;
        }
        elementWrapper.innerHTML = innerHTML;

        canvasArea.insertBefore(elementWrapper, insertBeforeElement);

        elementWrapper.querySelector('.element-delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this element?')) {
                elementWrapper.remove();
                if (selectedElement === elementWrapper) selectElement(null);
            }
        });

        selectElement(elementWrapper);
        elementWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return elementWrapper;
    }

    canvasArea.addEventListener('click', (e) => {
        const targetElement = e.target.closest('.canvas-element');
        selectElement(targetElement);
    });

    function selectElement(element) {
        if (selectedElement) selectedElement.classList.remove('selected');
        selectedElement = element;
        if (selectedElement) {
            selectedElement.classList.add('selected');
            updateInspector(selectedElement);
        } else {
            inspector.innerHTML = `<div class="inspector-placeholder"><i class="fas fa-mouse-pointer"></i><p>Select an element to edit</p></div> ${getGlobalSettingsHTML()}`;
            addGlobalSettingsListeners();
        }
    }

    function updateInspector(element) {
        const type = element.dataset.type;
        inspector.innerHTML = `<div class="inspector-section"><h4><i class="fas fa-cog"></i> Element Settings</h4><p>Type: <strong>${type.toUpperCase()}</strong></p></div> ${getGlobalSettingsHTML()}`;
        addGlobalSettingsListeners();
    }

    function getGlobalSettingsHTML() {
        const isPrintView = canvasArea.classList.contains('view-print');
        return ' '
    }

    function addGlobalSettingsListeners() {
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                canvasArea.classList.toggle('view-print', btn.dataset.view === 'print');
                selectElement(selectedElement);
            });
        });
    }

    aiFab.addEventListener('click', () => aiModalOverlay.classList.add('visible'));
    modalCloseBtn.addEventListener('click', () => aiModalOverlay.classList.remove('visible'));
    aiModalOverlay.addEventListener('click', (e) => { if (e.target === aiModalOverlay) aiModalOverlay.classList.remove('visible'); });

    // Initial State
    selectElement(null);
    createElement('text', { title: 'Welcome to EduCreate!', body: 'Drag new elements from the left, or drag existing elements to re-order them!'});
});
