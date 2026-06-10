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
        "No. CalmLoop is a self-reflection tool meant to support personal journaling and cognitive awareness. It is built on therapeutic models like ERP and ACT but does not provide clinical diagnosis, medical advice, or replacement for real human therapists.",
    },
    {
      question: "What are ERP and ACT?",
      answer:
        "ERP (Exposure and Response Prevention) is the gold standard for OCD, focusing on facing anxiety triggers without performing safety behaviors (compulsions). ACT (Acceptance and Commitment Therapy) helps you accept uncomfortable feelings while taking action aligned with what you value most.",
    },
    {
      question: "How is my journal data protected?",
      answer:
        "We take data security very seriously. All entries are encrypted locally on your device, and we implement industry-standard database security protocols. Your mental health thoughts are private, personal, and strictly yours.",
    },
  ];

  return (
    <section className="w-full mx-auto max-w-4xl px-6 py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">
          Frequently Asked Questions
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
