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
let extractedText = '';
let generatedQuestions = [];

// OpenAI API Configuration
// IMPORTANT: In production, this should be stored securely on the backend
// For demonstration purposes only - never expose API keys in client-side code
const OPENAI_API_KEY = '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'; // Replace with your actual API key
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

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
            progressText.textContent = 'Upload complete! Extracting text...';
            
            // Extract text from PDF
            extractTextFromPDF(selectedFile);
        }
        
        progressFill.style.width = progress + '%';
    }, 200);
}

// Extract text from PDF using PDF.js
async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
        }
        
        extractedText = fullText;
        progressText.textContent = 'Text extracted successfully!';
        console.log('Extracted text length:', extractedText.length);
        
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        progressText.textContent = 'Error extracting text. Please try again.';
        alert('Failed to extract text from PDF. Please try another file.');
    }
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
generateBtn.addEventListener('click', async () => {
    if (!selectedFile || !extractedText) {
        alert('Please wait for the PDF to finish uploading and processing.');
        return;
    }
    
    // Disable button during processing
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="btn-text">Processing...</span>';
    
    // Update progress
    progressText.textContent = 'Analyzing your PDF with AI...';
    progressFill.style.width = '0%';
    
    try {
        // Generate study materials using OpenAI
        await generateStudyMaterials(extractedText);
        
    } catch (error) {
        console.error('Error generating study guide:', error);
        alert('Failed to generate study guide. Please try again.');
        
        // Re-enable button on error
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<span class="btn-text">Generate Study Guide</span><span class="btn-icon">→</span>';
    }
});

// Generate study materials using OpenAI API
async function generateStudyMaterials(text) {
    // Truncate text if too long (to stay within token limits)
    const maxChars = 10000;
    const truncatedText = text.length > maxChars ? text.substring(0, maxChars) + '...' : text;
    
    // Update progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        if (progress <= 90) {
            progressFill.style.width = progress + '%';
        }
    }, 300);
    
    progressText.textContent = 'Analyzing content with AI...';
    
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert educational assistant that creates comprehensive study guides. Your task is to analyze the provided text and create study materials including key concepts, practice questions, and summaries.'
                    },
                    {
                        role: 'user',
                        content: `Please analyze the following text from a student's notes and create a comprehensive study guide. Include:

1. A brief summary (2-3 sentences)
2. 5-7 key concepts with explanations
3. 10 practice questions (mix of multiple choice, true/false, and short answer)
4. 5 important terms with definitions

Text to analyze:
${truncatedText}

Format your response as JSON with the following structure:
{
  "summary": "...",
  "keyConcepts": [{"concept": "...", "explanation": "..."}],
  "questions": [{"type": "multiple-choice|true-false|short-answer", "question": "...", "options": ["..."], "answer": "..."}],
  "terms": [{"term": "...", "definition": "..."}]
}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });
        
        clearInterval(progressInterval);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // Parse the JSON response
        let studyGuide;
        try {
            // Try to extract JSON from the response
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                studyGuide = JSON.parse(jsonMatch[0]);
            } else {
                studyGuide = JSON.parse(aiResponse);
            }
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            // Fallback to raw response
            studyGuide = { raw: aiResponse };
        }
        
        // Store generated materials
        generatedQuestions = studyGuide;
        
        // Update progress to completion
        progressFill.style.width = '100%';
        progressText.textContent = 'Study guide generated successfully!';
        
        // Save to localStorage for the study guide page
        localStorage.setItem('studyGuide', JSON.stringify(studyGuide));
        localStorage.setItem('originalFileName', selectedFile.name);
        
        // Show success modal
        setTimeout(() => {
            successModal.style.display = 'flex';
        }, 500);
        
    } catch (error) {
        clearInterval(progressInterval);
        throw error;
    }
}

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