// app/admin/prompts/page.tsx
"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  History,
  TrendingUp,
  Save,
  RotateCcw,
  Edit,
  Loader2,
  FileText,
} from "lucide-react";
import Navbar from "@/components/header-footer/navbar";

export default function PromptManagerPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState("");
  const [changeLog, setChangeLog] = useState("");

  // Queries
  const { data: prompts = [], isLoading } = useQuery(
    trpc.prompts.getAll.queryOptions(),
  );

  const { data: promptDetail } = useQuery(
    trpc.prompts.getOne.queryOptions(
      { name: selectedPrompt! },
      { enabled: !!selectedPrompt },
    ),
  );

  const { data: analytics } = useQuery(
    trpc.prompts.getAnalytics.queryOptions(
      { name: selectedPrompt!, days: 7 },
      { enabled: !!selectedPrompt },
    ),
  );

  // Mutations
  const updatePrompt = useMutation(
    trpc.prompts.upsert.mutationOptions({
      onSuccess: () => {
        toast.success("Prompt updated successfully!");
        setEditMode(false);
        setChangeLog("");
        queryClient.invalidateQueries(trpc.prompts.getAll.queryOptions());
        if (selectedPrompt) {
          queryClient.invalidateQueries(
            trpc.prompts.getOne.queryOptions({ name: selectedPrompt }),
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const rollbackPrompt = useMutation(
    trpc.prompts.rollback.mutationOptions({
      onSuccess: () => {
        toast.success("Rolled back successfully!");
        queryClient.invalidateQueries(trpc.prompts.getAll.queryOptions());
        if (selectedPrompt) {
          queryClient.invalidateQueries(
            trpc.prompts.getOne.queryOptions({ name: selectedPrompt }),
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleSave = () => {
    if (!selectedPrompt) return;

    updatePrompt.mutate({
      name: selectedPrompt,
      content,
      changeLog,
    });
  };

  const handleRollback = (version: number) => {
    if (!selectedPrompt) return;

    if (confirm(`Are you sure you want to rollback to version ${version}?`)) {
      rollbackPrompt.mutate({
        name: selectedPrompt,
        version,
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading prompts...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Prompt Manager
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and optimize your AI prompts with version control and
              analytics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Prompt List */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <div className="mb-4 pb-3 border-b">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Templates
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {prompts.length}{" "}
                    {prompts.length === 1 ? "prompt" : "prompts"}
                  </p>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-1">
                  {prompts.map((prompt) => (
                    <Button
                      key={prompt.id}
                      variant={
                        selectedPrompt === prompt.name ? "secondary" : "ghost"
                      }
                      className="w-full justify-start h-auto py-3 px-3"
                      onClick={() => {
                        setSelectedPrompt(prompt.name);
                        setContent(prompt.content);
                        setEditMode(false);
                      }}
                    >
                      <div className="flex flex-col items-start gap-1.5 w-full text-left">
                        <span className="font-medium text-sm leading-none">
                          {prompt.name}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            v{prompt.version}
                          </Badge>
                          {prompt.category && (
                            <Badge
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {prompt.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {selectedPrompt && promptDetail ? (
                <>
                  {/* Header */}
                  <Card className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">
                          {promptDetail.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {promptDetail.description ||
                            "No description provided"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-sm">
                          Version {promptDetail.version}
                        </Badge>
                        {!editMode ? (
                          <Button size="sm" onClick={() => setEditMode(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditMode(false);
                                setContent(promptDetail.content);
                                setChangeLog("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSave}
                              disabled={updatePrompt.isPending}
                            >
                              {updatePrompt.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Save
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Tabs */}
                  <Tabs defaultValue="editor" className="w-full">
                    <TabsList className="w-full sm:w-auto">
                      <TabsTrigger
                        value="editor"
                        className="flex-1 sm:flex-initial"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editor
                      </TabsTrigger>
                      <TabsTrigger
                        value="history"
                        className="flex-1 sm:flex-initial"
                      >
                        <History className="h-4 w-4 mr-2" />
                        History
                      </TabsTrigger>
                      <TabsTrigger
                        value="analytics"
                        className="flex-1 sm:flex-initial"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analytics
                      </TabsTrigger>
                    </TabsList>

                    {/* Editor Tab */}
                    <TabsContent value="editor" className="space-y-4 mt-4">
                      <Card className="p-6">
                        {editMode && (
                          <div className="mb-4">
                            <label className="text-sm font-medium mb-2 block">
                              Change Log
                            </label>
                            <Input
                              placeholder="Describe your changes (optional)"
                              value={changeLog}
                              onChange={(e) => setChangeLog(e.target.value)}
                              className="max-w-2xl"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Prompt Content
                          </label>
                          <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={!editMode}
                            className="font-mono text-sm min-h-125 resize-none"
                            placeholder="Enter your prompt content here..."
                          />
                        </div>

                        {editMode && (
                          <div className="mt-4 p-3 bg-muted/50 rounded-md">
                            <p className="text-xs text-muted-foreground">
                              💡 Tip: Use clear, structured prompts for best
                              results. Version history is automatically tracked.
                            </p>
                          </div>
                        )}
                      </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="mt-4">
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">Version History</h3>

                        {promptDetail.versions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No version history available</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {promptDetail.versions.map((version) => (
                              <div
                                key={version.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <Badge
                                      variant="outline"
                                      className="font-mono"
                                    >
                                      v{version.version}
                                    </Badge>
                                    {version.changeLog && (
                                      <span className="text-sm text-muted-foreground truncate">
                                        {version.changeLog}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(version.createdAt).toLocaleString(
                                      "en-US",
                                      {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      },
                                    )}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleRollback(version.version)
                                  }
                                  disabled={
                                    rollbackPrompt.isPending ||
                                    version.version === promptDetail.version
                                  }
                                  className="shrink-0"
                                >
                                  {rollbackPrompt.isPending ? (
                                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                  ) : (
                                    <RotateCcw className="h-3 w-3 mr-2" />
                                  )}
                                  Rollback
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="mt-4">
                      {analytics ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Card className="p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                              Total Usage
                            </h3>
                            <p className="text-4xl font-bold mb-1">
                              {analytics.total.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last 7 days
                            </p>
                          </Card>

                          <Card className="p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                              Success Rate
                            </h3>
                            <p className="text-4xl font-bold mb-1 text-green-600">
                              {analytics.successRate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {analytics.successful.toLocaleString()} /{" "}
                              {analytics.total.toLocaleString()} successful
                            </p>
                          </Card>

                          <Card className="p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                              Avg Latency
                            </h3>
                            <p className="text-4xl font-bold mb-1">
                              {analytics.avgLatency}
                              <span className="text-xl text-muted-foreground ml-1">
                                ms
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Average response time
                            </p>
                          </Card>

                          <Card className="p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                              Failed Requests
                            </h3>
                            <p className="text-4xl font-bold mb-1 text-red-600">
                              {analytics.failed.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Errors in last 7 days
                            </p>
                          </Card>
                        </div>
                      ) : (
                        <Card className="p-12 text-center">
                          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No analytics data available
                          </p>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <Card className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="h-16 w-16 text-muted-foreground/50" />
                    <div>
                      <p className="text-lg font-medium mb-1">
                        No Prompt Selected
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Select a prompt from the sidebar to view and edit
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
