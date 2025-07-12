// File list to store uploaded files
let fileList = [];

// Handle dragover event to allow files to be dropped
const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('dragover', function(event) {
    event.preventDefault();
    dropArea.classList.add('hover'); // Add hover effect when dragging over
});

// Handle dragleave event to remove hover effect
dropArea.addEventListener('dragleave', function(event) {
    event.preventDefault();
    dropArea.classList.remove('hover');
});

// Handle drop event to capture files
dropArea.addEventListener('drop', function(event) {
    event.preventDefault();
    dropArea.classList.remove('hover');
    const files = event.dataTransfer.files;
    handleFiles(files);
});

// Handle file selection via the "Select File" button
document.getElementById('file-input').addEventListener('change', function(event) {
    const files = event.target.files;
    handleFiles(files);
});

// Handle files by adding them to the list and updating the UI
function handleFiles(files) {
    for (const file of files) {
        fileList.push(file);  // Add files to the list
    }
    updateFileList();  // Update the UI to display the list
}

// Update the displayed file list at the bottom of the drag and drop area
function updateFileList() {
    const fileListContainer = document.getElementById('file-list-container');
    fileListContainer.innerHTML = '';  // Clear the existing list

    // If no files, show a message
    if (fileList.length === 0) {
        fileListContainer.innerHTML = '<p>No files uploaded yet.</p>';
        return;
    }

    // Display each file in the list
    fileList.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <button onclick="removeFile(${index})">Remove</button>
        `;
        fileListContainer.appendChild(fileItem);
    });
}

// Remove a file from the list
function removeFile(index) {
    fileList.splice(index, 1);  // Remove file from the array
    updateFileList();  // Re-render the file list
}
