import React from 'react'

const MessageContainerSkeleton = () => {
  return (
    <div className="flex flex-col flex-1 min-h-0 p-3 space-y-4">
      {/* Message 1: User (Right aligned) */}
      <div className="self-end w-2/3 h-12 bg-muted rounded-lg animate-pulse" />
      
      {/* Message 2: Assistant (Left aligned) */}
      <div className="self-start w-3/4 space-y-2 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/6 bg-muted rounded" />
      </div>

      {/* Message 3: User (Right aligned) */}
      <div className="self-end w-1/2 h-12 bg-muted rounded-lg animate-pulse" />
      
      {/* Message 4: Assistant (Left aligned) - Long response */}
      <div className="self-start w-4/5 space-y-2 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/5 bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>

      {/* Message 5: User (Right aligned) */}
      <div className="self-end w-3/5 h-12 bg-muted rounded-lg animate-pulse" />
      
      {/* Message 6: Assistant (Left aligned) */}
      <div className="self-start w-3/4 space-y-2 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-4/5 bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>

      {/* Message 7: User (Right aligned) */}
      <div className="self-end w-2/5 h-12 bg-muted rounded-lg animate-pulse" />
      
      {/* Message 8: Assistant (Left aligned) - Medium response */}
      <div className="self-start w-3/4 space-y-2 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>

      {/* Message 9: User (Right aligned) */}
      <div className="self-end w-1/2 h-12 bg-muted rounded-lg animate-pulse" />
      
      {/* Message 10: Assistant (Left aligned) - Very long response */}
      <div className="self-start w-4/5 space-y-2 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-4/5 bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>

      {/* Message 11: User (Right aligned) */}
      <div className="self-end w-3/5 h-12 bg-muted rounded-lg animate-pulse" />
      
      {/* Message 12: Assistant (Left aligned) */}
      <div className="self-start w-3/4 space-y-2 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/6 bg-muted rounded" />
      </div>

      {/* Message 13: User (Right aligned) */}
      <div className="self-end w-2/3 h-12 bg-muted rounded-lg animate-pulse" />
      
      {/* Message 14: Assistant (Left aligned) - Short response */}
      <div className="self-start w-2/3 space-y-2 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>

      {/* Message 15: User (Right aligned) */}
      <div className="self-end w-1/2 h-12 bg-muted rounded-lg animate-pulse" />
      
      {/* Message 16: Assistant (Left aligned) */}
      <div className="self-start w-4/5 space-y-2 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/5 bg-muted rounded" />
      </div>

      {/* Message 17: User (Right aligned) */}
      <div className="self-end w-2/5 h-12 bg-muted rounded-lg animate-pulse" />
      
      {/* Message 18: Assistant (Left aligned) - Final response */}
      <div className="self-start w-3/4 space-y-2 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/5 bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>
    </div>
  )
}

export default MessageContainerSkeleton