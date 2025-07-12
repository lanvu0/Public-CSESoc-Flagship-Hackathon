document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const convertBtn = document.getElementById('convertBtn');
    const extractedText = document.getElementById('extractedText');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const clearTextBtn = document.getElementById('clearTextBtn');
    const dropZone = document.querySelector('.drop-zone');

    // Handle drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('highlight');
    }

    function unhighlight() {
        dropZone.classList.remove('highlight');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            imageUpload.files = files;
            handleFiles(files);
        }
    }

    // Handle file selection via click
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files.length) {
            handleFiles(e.target.files);
        }
    });

    function handleFiles(files) {
        const file = files[0];
        if (file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // You could display a preview here if needed
                console.log('Image selected:', file.name);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file.');
        }
    }

    // Convert button handler with OCR
    convertBtn.addEventListener('click', async function() {
        const file = imageUpload.files[0];
        if (!file) {
            alert('Please select an image first');
            return;
        }
        
        // Show loading state
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        extractedText.placeholder = "Extracting text...";
        
        try {
            // Perform OCR using Tesseract.js
            const { data: { text } } = await Tesseract.recognize(
                file,
                'eng',  // Language (English)
                {
                    logger: m => console.log(m) // Optional progress logger
                }
            );
            
            // Display extracted text
            extractedText.value = text;
            
            // Show success state briefly
            convertBtn.innerHTML = '<i class="fas fa-check"></i> Done!';
            setTimeout(() => {
                convertBtn.innerHTML = '<i class="fas fa-magic"></i> Convert Image to Text';
                convertBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('OCR Error:', error);
            extractedText.value = "Error extracting text. Please try another image.";
            convertBtn.innerHTML = '<i class="fas fa-magic"></i> Try Again';
            convertBtn.disabled = false;
        }
    });
    
    // Copy text handler
    copyTextBtn.addEventListener('click', function() {
        if (extractedText.value) {
            extractedText.select();
            document.execCommand('copy');
            
            // Visual feedback
            const originalText = copyTextBtn.innerHTML;
            copyTextBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyTextBtn.innerHTML = originalText;
            }, 2000);
        }
    });
    
    // Clear text handler
    clearTextBtn.addEventListener('click', function() {
        extractedText.value = '';
        imageUpload.value = '';
    });
});