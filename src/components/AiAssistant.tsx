import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, MessageSquare } from "lucide-react";
import { mockTelemetry, mockAnomalies, healthScore, machineStatus } from "@/lib/mockData";
import { useAiAssistant } from "./AiAssistantContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function generateResponse(question: string): string {
  const q = question.toLowerCase();
  const latest = mockTelemetry[mockTelemetry.length - 1];
  const avgTorque = Math.round(mockTelemetry.reduce((s, d) => s + d.torque, 0) / mockTelemetry.length);
  const maxTemp = Math.max(...mockTelemetry.map((d) => d.temperature));
  const highAnomalies = mockAnomalies.filter((a) => a.severity === "high");

  if (q.includes("health") || q.includes("score")) {
    return `The current health score is **${healthScore}/100**. This is calculated from anomaly severity (${mockAnomalies.length} active alerts), average torque levels (${avgTorque} Nmm), and peak temperature (${maxTemp.toFixed(1)}°C). ${healthScore < 70 ? "The score is below optimal — I'd recommend investigating the high-severity alerts first." : "The system is in reasonable condition but keep an eye on the active warnings."}`;
  }

  if (q.includes("torque")) {
    return `Current torque reading is **${latest.torque} Nmm** with an average of **${avgTorque} Nmm** over the last 2 hours. The threshold is set at 1,000 Nmm. ${highAnomalies.some((a) => a.type === "torque_spike") ? "A torque spike was detected earlier — this could indicate mechanical resistance, valve sticking, or debris in the actuator path. **Recommended action:** Schedule a physical inspection of the actuator and valve linkage." : "Torque levels are within normal operating range."}`;
  }

  if (q.includes("temperature") || q.includes("temp")) {
    return `Internal temperature is currently **${latest.temperature.toFixed(1)}°C**, with a peak of **${maxTemp.toFixed(1)}°C** in the last 2 hours. The warning limit is 50°C. ${maxTemp > 40 ? "Temperature is trending upward — this could be caused by continuous operation, high ambient temperature, or increased mechanical load. **Recommended action:** Check ventilation and consider duty cycle adjustments." : "Temperature is well within safe limits."}`;
  }

  if (q.includes("anomal") || q.includes("alert") || q.includes("warning") || q.includes("caused") || q.includes("guidance")) {
    const summary = mockAnomalies.map((a) => `- **${a.severity.toUpperCase()}**: ${a.message}`).join("\n");
    return `There are **${mockAnomalies.length} active anomalies**:\n\n${summary}\n\nHigh-severity alerts should be investigated first as they may indicate equipment degradation. **Recommended:** Check mechanical linkages and review operating conditions.`;
  }

  if (q.includes("status") || q.includes("state") || q.includes("running")) {
    return `The machine is currently **${machineStatus.state}** (since ${machineStatus.lastStateChange}). Total uptime in this session: **${machineStatus.uptime}**. The system has cycled through multiple states in the last 2 hours including off, running, and stillstand periods.`;
  }

  if (q.includes("position") || q.includes("setpoint") || q.includes("feedback") || q.includes("drift") || q.includes("accurate") || q.includes("tracking")) {
    const drift = Math.abs(latest.setpoint - latest.feedback);
    return `Current setpoint is **${latest.setpoint}%** with feedback at **${latest.feedback}%** (drift: ${drift.toFixed(1)}%). ${drift > 3 ? "There's notable drift between setpoint and feedback — this may indicate mechanical wear, potentiometer degradation, or calibration issues. **Recommended:** Run a calibration cycle and inspect linkage." : "Position tracking is accurate with minimal drift."}`;
  }

  if (q.includes("power") || q.includes("consumption") || q.includes("energy")) {
    return `Current power consumption is **${latest.power} W**. Average across the session is approximately ${(mockTelemetry.reduce((s, d) => s + d.power, 0) / mockTelemetry.length).toFixed(2)} W. Power spikes typically correlate with high-torque events during valve movement.`;
  }

  if (q.includes("oscillation") || q.includes("hunting")) {
    return `Position oscillation occurs when the actuator repeatedly overshoots and corrects around the setpoint. Current deviation is **±8%**. This is typically caused by:\n\n- **PID tuning issues** — control loop gains may be too aggressive\n- **Mechanical play** — loose linkage or worn gears\n- **Signal noise** — electrical interference on feedback signal\n\n**Recommended:** Review PID parameters and check for mechanical backlash.`;
  }

  if (q.includes("help") || q.includes("what can")) {
    return "I can help you understand your actuator data. Try asking about:\n\n- **Health score** — what it means and how it's calculated\n- **Torque readings** — current values and anomalies\n- **Temperature** — trends and limits\n- **Anomalies** — active alerts and their severity\n- **Machine status** — current state and uptime\n- **Position** — setpoint vs feedback accuracy\n- **Power consumption** — current and average readings";
  }

  return `Based on the current telemetry, here's a quick overview: Health score is **${healthScore}/100**, the machine is **${machineStatus.state}**, with **${mockAnomalies.length} active alerts**. Current readings — Torque: ${latest.torque} Nmm, Temp: ${latest.temperature.toFixed(1)}°C, Power: ${latest.power} W, Position: ${latest.feedback}%.\n\nFeel free to ask about any specific metric for more detail.`;
}

export function AiAssistant() {
  const { isOpen, setIsOpen, consumeQuestion, pendingQuestion } = useAiAssistant();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi, I'm your actuator data assistant. Ask me anything about the telemetry, health score, anomalies, or machine status — or click any metric for details." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle incoming questions from context
  useEffect(() => {
    if (isOpen && pendingQuestion) {
      const question = consumeQuestion();
      if (question) {
        const userMsg: Message = { role: "user", content: question };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);
        setTimeout(() => {
          const response = generateResponse(question);
          setMessages((prev) => [...prev, { role: "assistant", content: response }]);
          setIsTyping(false);
        }, 600 + Math.random() * 800);
      }
    }
  }, [isOpen, pendingQuestion, consumeQuestion]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMsg.content);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col shadow-2xl border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground text-sm">Data Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {msg.content.split("**").map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">
                Analyzing data...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data..."
            className="flex-1 text-sm"
          />
          <Button type="submit" size="icon" className="shrink-0" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
