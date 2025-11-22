// UPLOAD API - File Upload Operations
// 📤 Image and file upload operations

// Import the specialized FormData request function from API configuration
// This handles file uploads with proper Content-Type headers for multipart/form-data
import { makeFormDataRequest } from './api.config.js';

// Export uploadAPI object containing all file upload related methods
export const uploadAPI = {
  
  // UPLOAD IMAGE - Upload single image file
  // Parameters:
  // - file: File object from input[type="file"] or File API
  // Process:
  // 1. Creates FormData object for multipart form submission
  // 2. Appends the file with field name 'image'
  // 3. Sends POST request to upload endpoint
  // Returns: Promise with upload response containing file URL or ID
  uploadImage: (file) => {
    // Create FormData object for file upload
    const formData = new FormData();
    
    // Append the file to FormData with field name 'image'
    // This matches what the server expects for single file uploads
    formData.append('image', file);
    
    // Send POST request using specialized FormData handler
    return makeFormDataRequest('/upload/image', formData, 'POST');
  },
  
  // UPLOAD MULTIPLE - Upload multiple image files
  // Parameters:
  // - files: Array of File objects
  // Process:
  // 1. Creates FormData object for multipart form submission
  // 2. Appends each file with field name 'images[]' (array format)
  // 3. Sends POST request to multiple upload endpoint
  // Returns: Promise with array of uploaded file responses
  uploadMultiple: (files) => {
    // Create FormData object for multiple file upload
    const formData = new FormData();
    
    // Loop through each file in the array and append to FormData
    // Using 'images[]' field name tells server to expect multiple files
    files.forEach(file => {
      formData.append('images[]', file);
    });
    
    // Send POST request using specialized FormData handler
    return makeFormDataRequest('/upload/multiple', formData, 'POST');
  },
};

// Default export for easier importing
// Usage: import uploadAPI from './upload.api.js'
export default uploadAPI;