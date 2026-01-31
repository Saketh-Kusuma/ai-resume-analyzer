import React from "react";
import { cn } from "../utils/index";
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
} from "./Accordin";

// Helper Component: ScoreBadge
const ScoreBadge = ({ score }: { score: number }) => {
    let badgeClass = "";
    let icon = null;
    let textClass = "";

    if (score > 69) {
        badgeClass = "bg-green-100";
        textClass = "text-green-700";
        icon = <img src="/icons/check.svg" alt="Check" className="w-3 h-3" />;
    } else if (score > 39) {
        badgeClass = "bg-yellow-100";
        textClass = "text-yellow-700";
    } else {
        badgeClass = "bg-red-100";
        textClass = "text-red-700";
    }

    return (
        <div
            className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                badgeClass
            )}
        >
            {score > 69 && icon}
            <span className={cn("text-xs font-semibold", textClass)}>
                {score}/100
            </span>
        </div>
    );
};

// Helper Component: CategoryHeader
const CategoryHeader = ({
    title,
    categoryScore,
}: {
    title: string;
    categoryScore: number;
}) => {
    return (
        <div className="flex items-center gap-4 w-full">
            <span className="text-gray-900 font-medium">{title}</span>
            <ScoreBadge score={categoryScore} />
        </div>
    );
};

// Helper Component: CategoryContent
const CategoryContent = ({
    tips,
}: {
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <img
                            src={item.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                            alt={item.type}
                            className="w-5 h-5 mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-gray-700">{item.tip}</p>
                    </div>
                ))}
            </div>

            {/* Explanations List */}
            <div className="flex flex-col gap-3">
                {tips.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            "p-4 rounded-xl text-sm leading-relaxed",
                            item.type === "good"
                                ? "bg-green-50/50 border border-green-100 text-gray-700"
                                : "bg-red-50/50 border border-red-100 text-gray-700"
                        )}
                    >
                        <span className="font-semibold block mb-1">
                            {item.type === "good" ? "Why this works:" : "How to fix:"}
                        </span>
                        {item.explanation}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Details = ({ feedBack }: { feedBack: Feedback }) => {
    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Detailed Analysis</h2>
            </div>
            <Accordion allowMultiple className="divide-y divide-gray-100">
                <AccordionItem id="tone">
                    <AccordionHeader itemId="tone">
                        <CategoryHeader
                            title="Tone & Style"
                            categoryScore={feedBack.toneAndStyle.score}
                        />
                    </AccordionHeader>
                    <AccordionContent itemId="tone">
                        <CategoryContent tips={feedBack.toneAndStyle.tips} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem id="content">
                    <AccordionHeader itemId="content">
                        <CategoryHeader
                            title="Content"
                            categoryScore={feedBack.content.score}
                        />
                    </AccordionHeader>
                    <AccordionContent itemId="content">
                        <CategoryContent tips={feedBack.content.tips} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem id="structure">
                    <AccordionHeader itemId="structure">
                        <CategoryHeader
                            title="Structure"
                            categoryScore={feedBack.structure.score}
                        />
                    </AccordionHeader>
                    <AccordionContent itemId="structure">
                        <CategoryContent tips={feedBack.structure.tips} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem id="skills">
                    <AccordionHeader itemId="skills">
                        <CategoryHeader
                            title="Skills"
                            categoryScore={feedBack.skills.score}
                        />
                    </AccordionHeader>
                    <AccordionContent itemId="skills">
                        <CategoryContent tips={feedBack.skills.tips} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Details;