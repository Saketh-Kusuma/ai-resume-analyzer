import React from "react";

interface ATSProps {
    score: number;
    suggestions: {
        type: "good" | "improve";
        tip: string;
    }[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
    let gradientClass = "";
    let iconSrc = "";
    let scoreColor = "";

    if (score > 69) {
        gradientClass = "from-green-100";
        iconSrc = "/icons/ats-good.svg";
        scoreColor = "text-green-600";
    } else if (score > 49) {
        gradientClass = "from-yellow-100";
        iconSrc = "/icons/ats-warning.svg";
        scoreColor = "text-yellow-600";
    } else {
        gradientClass = "from-red-100";
        iconSrc = "/icons/ats-bad.svg";
        scoreColor = "text-red-600";
    }

    return (
        <div className={`flex flex-col gap-6 p-8 rounded-2xl bg-linear-to-b ${gradientClass} to-white w-full border border-gray-100`}>
            <div className="flex flex-row items-center gap-4">
                <img src={iconSrc} alt="ATS Score Icon" className="w-16 h-16" />
                <h2 className="text-3xl font-bold text-gray-800">
                    ATS Score - <span className={scoreColor}>{score}</span>/100
                </h2>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-gray-800">Resume Scan Results</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                    Here is a detailed breakdown of how your resume performs against Applicant Tracking Systems. Follow the suggestions below to improve your score.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex flex-row items-start gap-3">
                        <img
                            src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                            alt={suggestion.type}
                            className="w-5 h-5 mt-0.5"
                        />
                        <p className="text-gray-700 text-sm leading-relaxed">{suggestion.tip}</p>
                    </div>
                ))}
            </div>

            <p className="text-sm text-gray-400 font-medium pt-4 border-t border-gray-200">
                Optimization is key to getting noticed by recruiters.
            </p>
        </div>
    );
};

export default ATS;