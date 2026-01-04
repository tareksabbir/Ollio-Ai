// modules/messages/ui/components/messages-container.tsx
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageCard from "../../ui/components/message-card";
import MessageForm from "../../ui/components/massage-form";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { Fragment } from "@/generated/prisma/browser";
import MessageLoading from "../../ui/components/massage-loading";
import { ComponentErrorBoundary } from "@/components/error-boundary/component-error-boundary";

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
    trpc.messages.getMany.queryOptions({ projectId }, { refetchInterval: 5000 })
  );

  const lastMessage = useMemo(() => messages[messages.length - 1], [messages]);
  const isLastMessageUser = useMemo(
    () => lastMessage?.role === "USER",
    [lastMessage]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

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

  const handleFragmentClick = useCallback(
    (fragment: Fragment | null) => {
      setActiveFragment(fragment);
    },
    [setActiveFragment]
  );

  return (
    <section className="flex flex-col flex-1 min-h-0">
      {/* Messages with individual error boundaries */}
      <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1 space-y-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <ComponentErrorBoundary 
                key={message.id}
                componentName="MessageCard"
              >
                <MessageCard
                  content={message.content}
                  role={message.role}
                  fragment={message.fragment}
                  createdAt={message.createdAt}
                  isActiveFragment={activeFragment?.id === message.fragment?.id}
                  onFragmentClick={() => handleFragmentClick(message.fragment)}
                  type={message.type}
                />
              </ComponentErrorBoundary>
            ))
          )}

          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} aria-hidden="true" />
        </div>
      </div>

      {/* Message form with error boundary */}
      <div className="relative p-3 pt-1">
        <div
          className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none"
          aria-hidden="true"
        />
        <ComponentErrorBoundary componentName="MessageForm">
          <MessageForm projectId={projectId} />
        </ComponentErrorBoundary>
      </div>
    </section>
  );
};

export default MessageContainer;