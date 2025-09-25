import React, { useState } from 'react';

export function SimpleUploadTest() {
  const [result, setResult] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    
    if (!file) {
      setResult('No file selected');
      return;
    }

    setIsUploading(true);
    setResult('Uploading...');

    try {
      console.log('Uploading file:', file.name, file.size, file.type);
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      console.log('FormData entries:');
      for (const [key, value] of uploadFormData.entries()) {
        console.log(key, value);
      }

      const response = await fetch('http://127.0.0.1:8000/api/admin/upload-simple', {
        method: 'POST',
        body: uploadFormData,
        // Don't set Content-Type header - let browser set it with boundary
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Response text:', responseText);

      setResult(`Status: ${response.status}\nResponse: ${responseText}`);

    } catch (error) {
      console.error('Upload error:', error);
      setResult(`Error: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Simple Upload Test</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" name="file" accept=".txt,.pdf,.doc,.docx" required />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button type="submit" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px' }}>
        {result}
      </div>
    </div>
  );
}