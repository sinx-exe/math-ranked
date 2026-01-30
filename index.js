// Get DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeBtn = document.getElementById('removeBtn');
const generateBtn = document.getElementById('generateBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const successModal = document.getElementById('successModal');
const viewBtn = document.getElementById('viewBtn');

let selectedFile = null;

// Browse button click
browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

// Upload area click
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

// Drag and drop events
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        handleFile(file);
    } else {
        alert('Please upload a PDF file');
    }
});

// Handle file selection
function handleFile(file) {
    if (!file) return;
    
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        alert('File size exceeds 10MB limit');
        return;
    }
    
    selectedFile = file;
    
    // Update file preview
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // Hide upload area and show preview
    uploadArea.style.display = 'none';
    filePreview.style.display = 'block';
    
    // Enable generate button
    generateBtn.disabled = false;
    
    // Simulate upload progress
    simulateUpload();
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Simulate upload progress
function simulateUpload() {
    let progress = 0;
    progressFill.style.width = '0%';
    progressText.textContent = 'Uploading...';
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            progressText.textContent = 'Upload complete!';
        }
        
        progressFill.style.width = progress + '%';
    }, 200);
}

// Remove file
removeBtn.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    
    // Hide preview and show upload area
    filePreview.style.display = 'none';
    uploadArea.style.display = 'block';
    
    // Disable generate button
    generateBtn.disabled = true;
    
    // Reset progress
    progressFill.style.width = '0%';
});

// Generate study guide
generateBtn.addEventListener('click', () => {
    if (!selectedFile) return;
    
    // Disable button during processing
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="btn-text">Processing...</span>';
    
    // Update progress
    progressText.textContent = 'Analyzing your PDF...';
    
    // Simulate processing
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 50;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Show success modal after processing
            setTimeout(() => {
                successModal.style.display = 'flex';
            }, 500);
        }
        
        progressFill.style.width = progress + '%';
        
        // Update progress text based on progress
        if (progress < 30) {
            progressText.textContent = 'Analyzing your PDF...';
        } else if (progress < 60) {
            progressText.textContent = 'Extracting key concepts...';
        } else if (progress < 90) {
            progressText.textContent = 'Generating study materials...';
        } else {
            progressText.textContent = 'Finalizing your study guide...';
        }
    }, 300);
});

// View study guide button
viewBtn.addEventListener('click', () => {
    // In a real application, this would navigate to the study guide page
    alert('Redirecting to your study guide...');
    // window.location.href = 'study-guide.html';
});

// View study guide button
viewBtn.addEventListener('click', () => {
    // In a real application, this would navigate to the study guide page
    alert('Redirecting to your study guide...');
    // window.location.href = 'study-guide.html';
    
    // Reset after viewing
    resetUploadForm();
});

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.style.display = 'none';
        resetUploadForm();
    }
});

// Reset upload form function
function resetUploadForm() {
    selectedFile = null;
    fileInput.value = '';
    filePreview.style.display = 'none';
    uploadArea.style.display = 'block';
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="btn-text">Generate Study Guide</span><span class="btn-icon">→</span>';
    progressFill.style.width = '0%';
}

// Prevent default drag behavior on the whole page
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
});