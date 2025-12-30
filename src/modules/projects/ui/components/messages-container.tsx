import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageCard from "./message-card";
import MessageForm from "./massage-form";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { Fragment } from "@/generated/prisma/browser";
import MessageLoading from "./massage-loading";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

const MessageContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const trpc = useTRPC();
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      { refetchInterval: 5000 }
    )
  );

  // Memoize derived values
  const lastMessage = useMemo(
    () => messages[messages.length - 1],
    [messages]
  );
  
  const isLastMessageUser = useMemo(
    () => lastMessage?.role === "USER",
    [lastMessage]
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Handle active fragment updates
  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );

    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage.id !== lastAssistantMessageIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment]);

  // Memoize fragment click handler
  const handleFragmentClick = useCallback(
    (fragment: Fragment | null) => {
      setActiveFragment(fragment);
    },
    [setActiveFragment]
  );

  return (
    <section className="flex flex-col flex-1 min-h-0">
      {/* Messages scrollable area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto"
      >
        <div className="pt-2 pr-1 space-y-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageCard
                key={message.id}
                content={message.content}
                role={message.role}
                fragment={message.fragment}
                createdAt={message.createdAt}
                isActiveFragment={activeFragment?.id === message.fragment?.id}
                onFragmentClick={() => handleFragmentClick(message.fragment)}
                type={message.type}
              />
            ))
          )}
          
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} aria-hidden="true" />
        </div>
      </div>

      {/* Message input area with gradient overlay */}
      <div className="relative p-3 pt-1">
        <div 
          className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none" 
          aria-hidden="true"
        />
        <MessageForm projectId={projectId} />
      </div>
    </section>
  );
};

export default MessageContainer;
// import { useTRPC } from "@/trpc/client";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import MessageCard from "./message-card";
// import MessageForm from "./massage-form";
// import { useEffect, useRef } from "react";
// import { Fragment } from "@/generated/prisma/browser";
// import MessageLoading from "./massage-loading";

// interface Props {
//   projectId: string;
//   activeFragment: Fragment | null;
//   setActiveFragment: (fragment: Fragment | null) => void;
// }

// const MessageContainer = ({
//   projectId,
//   activeFragment,
//   setActiveFragment,
// }: Props) => {
//   const trpc = useTRPC();
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const lastAssistantMessageIdRef = useRef<string | null>(null);

//   const { data: messages } = useSuspenseQuery(
//     trpc.messages.getMany.queryOptions(
//       {
//         projectId,
//       },
//       {
//         refetchInterval: 5000,
//       }
//     )
//   );
//   useEffect(() => {
//     const lastAssistantMessage = messages.findLast(
//       (message) => message.role === "ASSISTANT"
//     );
//     if (
//       lastAssistantMessage?.fragment &&
//       lastAssistantMessage?.id !== lastAssistantMessageIdRef.current
//     ) {
//       setActiveFragment(lastAssistantMessage.fragment);
//       lastAssistantMessageIdRef.current = lastAssistantMessage.id;
//     }
//   }, [messages, setActiveFragment]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages.length]);
//   const lastMessage = messages[messages.length - 1];
//   const isLastMessageUser = lastMessage?.role === "USER";
//   return (
//     <section className="flex flex-col flex-1 min-h-0">
//       <div className="flex-1 min-h-0 overflow-y-auto">
//         <div className="pt-2 pr-1">
//           {messages?.map((message) => {
//             return (
//               <MessageCard
//                 key={message.id}
//                 content={message.content}
//                 role={message.role}
//                 fragment={message.fragment}
//                 createdAt={message.createdAt}
//                 isActiveFragment={activeFragment?.id === message.fragment?.id}
//                 onFragmentClick={() => setActiveFragment(message.fragment)}
//                 type={message.type}
//               />
//             );
//           })}
//           {isLastMessageUser && <MessageLoading />}
//           <div ref={bottomRef} />
//         </div>
//       </div>
//       <div className="relative p-3 pt-1">
//         <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none"></div>
//         <MessageForm projectId={projectId} />
//       </div>
//     </section>
//   );
// };

// export default MessageContainer;
