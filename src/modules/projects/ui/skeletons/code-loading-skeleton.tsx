import React from "react";

const CodeLoadingSkeleton = () => {
  return (
    <div className="flex h-full bg-background border-r border-border">
      {/* Sidebar with File Tree */}
      <div className="w-64 border-r border-border p-3 space-y-1 animate-pulse">
        {/* Project Name */}
        <div className="h-6 w-40 bg-muted rounded mb-4"></div>
        
        {/* Root Folder */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-muted rounded-sm"></div>
          <div className="h-4 w-20 bg-muted rounded"></div>
        </div>
        
        {/* src folder - expanded */}
        <div className="ml-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-muted rounded-sm"></div>
            <div className="h-4 w-16 bg-muted rounded"></div>
          </div>
          
          {/* components folder - expanded */}
          <div className="ml-4">
            <div className="flex items-center gap-2 mt-1">
              <div className="h-3 w-3 bg-muted rounded-sm"></div>
              <div className="h-4 w-24 bg-muted rounded"></div>
            </div>
            
            {/* nested files */}
            <div className="ml-5 space-y-1 mt-1">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-muted/60 rounded-sm"></div>
                <div className="h-3 w-28 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-muted/60 rounded-sm"></div>
                <div className="h-3 w-32 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-muted/60 rounded-sm"></div>
                <div className="h-3 w-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
          
          {/* utils folder */}
          <div className="ml-4 mt-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-muted rounded-sm"></div>
              <div className="h-4 w-16 bg-muted rounded"></div>
            </div>
            
            <div className="ml-5 space-y-1 mt-1">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-muted/60 rounded-sm"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-muted/60 rounded-sm"></div>
                <div className="h-3 w-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
          
          {/* hooks folder */}
          <div className="ml-4 mt-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-muted rounded-sm"></div>
              <div className="h-4 w-20 bg-muted rounded"></div>
            </div>
          </div>
          
          {/* App.tsx */}
          <div className="ml-4 mt-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-muted/60 rounded-sm"></div>
              <div className="h-3 w-16 bg-muted rounded"></div>
            </div>
          </div>
        </div>
        
        {/* public folder */}
        <div className="ml-3 mt-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-muted rounded-sm"></div>
            <div className="h-4 w-20 bg-muted rounded"></div>
          </div>
        </div>
        
        {/* Config files */}
        <div className="space-y-1 mt-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-muted/60 rounded-sm"></div>
            <div className="h-3 w-28 bg-muted rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-muted/60 rounded-sm"></div>
            <div className="h-3 w-24 bg-muted rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-muted/60 rounded-sm"></div>
            <div className="h-3 w-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 animate-pulse">
          <div className="h-6 w-32 bg-muted rounded"></div>
          <div className="h-6 w-28 bg-muted/50 rounded"></div>
        </div>
        
        {/* Line numbers and Code Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Line numbers */}
          <div className="w-12 border-r border-border p-4 text-right space-y-3 animate-pulse">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="h-4 w-6 bg-muted/40 rounded ml-auto"></div>
            ))}
          </div>
          
          {/* Code Content */}
          <div className="flex-1 p-6 space-y-3 animate-pulse overflow-auto">
            {/* Line 1-2: Import statements */}
            <div className="flex gap-3">
              <div className="h-4 w-64 bg-muted rounded"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-4 w-56 bg-muted rounded"></div>
            </div>
            <div className="h-3"></div>
            
            {/* Line 4: Function declaration */}
            <div className="flex gap-3">
              <div className="h-4 w-80 bg-muted rounded"></div>
            </div>
            
            {/* Line 5-15: Function body */}
            <div className="ml-8 space-y-3">
              <div className="flex gap-3">
                <div className="h-4 w-48 bg-muted rounded"></div>
              </div>
              <div className="h-2"></div>
              
              {/* Nested block */}
              <div className="ml-8 space-y-2">
                <div className="flex gap-3">
                  <div className="h-4 w-72 bg-muted rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-64 bg-muted rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-40 bg-muted rounded"></div>
                </div>
                
                {/* Deeply nested */}
                <div className="ml-8 space-y-2">
                  <div className="flex gap-3">
                    <div className="h-4 w-56 bg-muted rounded"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-4 w-60 bg-muted rounded"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-4 w-48 bg-muted rounded"></div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
              </div>
              
              <div className="h-2"></div>
              <div className="flex gap-3">
                <div className="h-4 w-52 bg-muted rounded"></div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-4 w-24 bg-muted rounded"></div>
            </div>
            
            <div className="h-4"></div>
            
            {/* Line 20-30: Another function */}
            <div className="flex gap-3">
              <div className="h-4 w-68 bg-muted rounded"></div>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex gap-3">
                <div className="h-4 w-96 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-44 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-52 bg-muted rounded"></div>
              </div>
              
              <div className="ml-8 space-y-2">
                <div className="flex gap-3">
                  <div className="h-4 w-80 bg-muted rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-72 bg-muted rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-4 w-28 bg-muted rounded"></div>
            </div>
            
            <div className="h-4"></div>
            
            {/* Line 35-50: Additional code */}
            <div className="flex gap-3">
              <div className="h-4 w-72 bg-muted rounded"></div>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex gap-3">
                <div className="h-4 w-64 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-80 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-56 bg-muted rounded"></div>
              </div>
              
              <div className="ml-8 space-y-2">
                <div className="flex gap-3">
                  <div className="h-4 w-48 bg-muted rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-72 bg-muted rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-60 bg-muted rounded"></div>
                </div>
                
                <div className="ml-8 space-y-2">
                  <div className="flex gap-3">
                    <div className="h-4 w-64 bg-muted rounded"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-4 w-52 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-4 w-52 bg-muted rounded"></div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-4 w-36 bg-muted rounded"></div>
            </div>
            
            <div className="h-4"></div>
            
            {/* Line 55-70: More code blocks */}
            <div className="flex gap-3">
              <div className="h-4 w-88 bg-muted rounded"></div>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex gap-3">
                <div className="h-4 w-64 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-48 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-72 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-56 bg-muted rounded"></div>
              </div>
              
              <div className="ml-8 space-y-2">
                <div className="flex gap-3">
                  <div className="h-4 w-60 bg-muted rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-68 bg-muted rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-52 bg-muted rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-4 w-32 bg-muted rounded"></div>
            </div>
            
            <div className="h-4"></div>
            
            {/* Line 75-85: Another section */}
            <div className="flex gap-3">
              <div className="h-4 w-76 bg-muted rounded"></div>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex gap-3">
                <div className="h-4 w-68 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-52 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-60 bg-muted rounded"></div>
              </div>
              
              <div className="ml-8 space-y-2">
                <div className="flex gap-3">
                  <div className="h-4 w-64 bg-muted rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-56 bg-muted rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-72 bg-muted rounded"></div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-4 w-48 bg-muted rounded"></div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-4 w-24 bg-muted rounded"></div>
            </div>
            
            <div className="h-4"></div>
            
            {/* Line 90-95: Final function */}
            <div className="flex gap-3">
              <div className="h-4 w-80 bg-muted rounded"></div>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex gap-3">
                <div className="h-4 w-72 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-64 bg-muted rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-56 bg-muted rounded"></div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-4 w-28 bg-muted rounded"></div>
            </div>
            
            <div className="h-4"></div>
            
            {/* Line 100: Export statement */}
            <div className="flex gap-3">
              <div className="h-4 w-56 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeLoadingSkeleton;