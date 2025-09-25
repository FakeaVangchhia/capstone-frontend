import React from 'react';
import { FileUpload } from '@/components/file-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { Settings, Upload, Database } from 'lucide-react';

export function AdminPage() {
  const { user } = useAuth();

  // Check if user is admin
  if (!user?.is_admin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">You need admin privileges to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUploadSuccess = (result: any) => {
    console.log('Upload successful:', result);
    // You can add additional success handling here
    // For example, refresh a list of uploaded documents
  };

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error);
    // You can add additional error handling here
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage the knowledge base and system settings
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          Admin Access
        </Badge>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          className="lg:col-span-1"
        />

        {/* Additional Admin Features */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base Stats</CardTitle>
            <CardDescription>
              Overview of uploaded documents and system status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Documents</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Text Chunks</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Updated</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">1.</span>
              <span>Select or drag and drop a text file (TXT, PDF, DOC, DOCX)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">2.</span>
              <span>Click "Upload File" to add the document to the knowledge base</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">3.</span>
              <span>The system will automatically process and chunk the text for AI responses</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">4.</span>
              <span>Students can now ask questions about the uploaded content in their chats</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}