import { useState, type FormEvent } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  requestMediaUploadUrl,
  submitMediaForApproval,
  uploadMediaFile,
} from "@/services/mediaService";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

const MediaUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [capturedAt, setCapturedAt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      toast({
        title: "Missing file",
        description: "Please choose a photo or video.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !submittedBy.trim() || !capturedAt) {
      toast({
        title: "Missing details",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast({
        title: "Unsupported file type",
        description: "Only images and videos are allowed.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 100MB.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const capturedAtIso = new Date(capturedAt).toISOString();
      const uploadUrlResponse = await requestMediaUploadUrl({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        capturedAt: capturedAtIso,
      });

      await uploadMediaFile(
        uploadUrlResponse.uploadUrl,
        uploadUrlResponse.uploadFields,
        file,
        file.type || "application/octet-stream"
      );

      await submitMediaForApproval({
        submissionId: uploadUrlResponse.submissionId,
        objectKey: uploadUrlResponse.objectKey,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        title: title.trim(),
        description: description.trim() || undefined,
        capturedAt: capturedAtIso,
        submittedBy: submittedBy.trim(),
      });

      toast({
        title: "Uploaded for review",
        description: "Thanks! Your media will appear in the archive after approval.",
      });

      setTitle("");
      setDescription("");
      setSubmittedBy("");
      setCapturedAt("");
      setFile(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while uploading your media.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50">
      <Navigation />
      <main className="pt-24 px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-fire-gradient">Upload to Captured in Movement</CardTitle>
              <CardDescription>
                Submit photos or clips for review. All uploads require approval before appearing in the archive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sunday Service - Banner Dance"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submittedBy">Your Name *</Label>
                  <Input
                    id="submittedBy"
                    value={submittedBy}
                    onChange={(e) => setSubmittedBy(e.target.value)}
                    placeholder="Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capturedAt">When was it captured? *</Label>
                  <Input
                    id="capturedAt"
                    type="datetime-local"
                    value={capturedAt}
                    onChange={(e) => setCapturedAt(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional context for reviewers"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Photo or Video *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-gray-500">Max size: 100MB</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-fire-purple hover:bg-fire-purple/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Submit for Approval
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MediaUpload;
