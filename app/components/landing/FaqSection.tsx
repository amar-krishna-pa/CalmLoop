"use client";

import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

type FaqItemProps = {
  question: string;
  answer: string;
};

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-subtle bg-card rounded-xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 cursor-pointer focus:outline-none text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-sm md:text-base text-primary">
          {question}
        </span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <IoIosArrowDown className="text-muted" size={20} />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-sm text-muted leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const faqs = [
    {
      question: "Is CalmLoop a replacement for professional therapy?",
      answer:
        "No. CalmLoop offers reflection and practice tools. It does not diagnose conditions or replace care from a qualified professional.",
    },
    {
      question: "What are ERP and ACT?",
      answer:
        "Exposure and response prevention (ERP) involves gradually facing feared situations while practising without compulsions, the actions you feel driven to repeat. Acceptance and commitment therapy (ACT) focuses on making room for difficult thoughts and feelings while acting on what matters to you.",
    },
    {
      question: "How are my entries used?",
      answer:
        "Your chats and saved fears are stored with your account. Chat messages and entries submitted for fear extraction are sent to Groq to generate responses. Share only the details you want processed.",
    },
  ];

  return (
    <section className="w-full mx-auto max-w-4xl px-6 py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">
          Common questions
        </h2>
      </div>

      <div className="space-y-4 w-full">
        {faqs.map((faq) => (
          <FaqItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </section>
  );
}
