import React from "react";

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    let badgeClasses = "";
    let label = "";

    if (score > 70) {
        badgeClasses = "bg-badge-green text-badge-green-text";
        label = "Strong";
    } else if (score > 49) {
        badgeClasses = "bg-badge-yellow text-badge-yellow-text";
        label = "Good Start";
    } else {
        badgeClasses = "bg-badge-red text-badge-red-text";
        label = "Needs Work";
    }

    return (
        <div className={`score-badge ${badgeClasses}`}>
            <p className="text-xs font-semibold">{label}</p>
        </div>
    );
};

export default ScoreBadge;
