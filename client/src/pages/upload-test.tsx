import React from 'react';
import { FileUpload } from '@/components/file-upload';
import { TeacherUpload } from '@/components/teacher-upload';
import { SimpleUploadTest } from '@/components/simple-upload-test';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UploadTestPage() {
  const handleUploadSuccess = (result: any) => {
    console.log('Upload successful:', result);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Upload className="h-8 w-8" />
            Upload Test Page
          </h1>
          <p className="text-gray-600 mt-1">
            Test file upload functionality for both admin and teacher interfaces
          </p>
        </div>
        <Badge variant="secondary">
          Testing Mode
        </Badge>
      </div>

      {/* Simple Test Component */}
      <SimpleUploadTest />

      {/* Upload Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Full Admin Upload Component */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Admin Upload Component</h2>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </div>

        {/* Teacher Upload Components */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Teacher Upload Components</h2>
          
          {/* Full Teacher Upload */}
          <TeacherUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
          
          {/* Compact Teacher Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compact Version</CardTitle>
              <CardDescription>
                Minimal upload interface for embedding in other components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeacherUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                compact={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">1.</span>
              <span>Both components work without authentication for testing purposes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">2.</span>
              <span>Try uploading a text file using either component</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">3.</span>
              <span>The admin component has more features like drag-and-drop</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">4.</span>
              <span>The teacher components are simpler and more focused</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">5.</span>
              <span>Check the browser console for upload results</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}