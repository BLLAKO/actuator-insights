import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AiAssistantContextType {
  isOpen: boolean;
  openWithQuestion: (question: string) => void;
  pendingQuestion: string | null;
  consumeQuestion: () => string | null;
  setIsOpen: (open: boolean) => void;
}

const AiAssistantContext = createContext<AiAssistantContextType | null>(null);

export function AiAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const openWithQuestion = useCallback((question: string) => {
    setPendingQuestion(question);
    setIsOpen(true);
  }, []);

  const consumeQuestion = useCallback(() => {
    const q = pendingQuestion;
    setPendingQuestion(null);
    return q;
  }, [pendingQuestion]);

  return (
    <AiAssistantContext.Provider value={{ isOpen, openWithQuestion, pendingQuestion, consumeQuestion, setIsOpen }}>
      {children}
    </AiAssistantContext.Provider>
  );
}

export function useAiAssistant() {
  const ctx = useContext(AiAssistantContext);
  if (!ctx) throw new Error("useAiAssistant must be used within AiAssistantProvider");
  return ctx;
}
