"use client";
import React from "react";
import { getMediaUrl } from "@/lib/api";

interface RichTextRendererProps {
  content: string | null | undefined;
  className?: string;
}

export default function RichTextRenderer({ content, className = "" }: RichTextRendererProps) {
  if (!content) return null;

  // Function to replace relative media paths with absolute ones
  const fixMediaPaths = (html: string) => {
    // Replace src="/media/..." with src="BACKEND_URL/media/..."
    // We use a regex to find all src="/media/" occurrences
    const backendBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace("/api/v1", "");
    
    return html.replace(
      /src="\/media\//g, 
      `src="${backendBase}/media/`
    );
  };

  const fixedContent = fixMediaPaths(content);

  return (
    <div 
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: fixedContent }}
    />
  );
}
