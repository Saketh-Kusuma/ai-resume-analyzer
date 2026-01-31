import ScoreGuage from "./ScoreGuage";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
    const textColor = score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-600" : "text-red-600";
    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-1 items-start">
                    <p className="text-2x;">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p><span className={textColor}>{score}</span>/100</p>
            </div>
        </div>
    )
}
const Summary = ({ feedBack }: { feedBack: Feedback }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGuage score={feedBack.overallScore} />
                <div className="flex flex-col items-center p-4 gap-2">
                    <h2 className="text-2xl font-bold">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">This score is based on the variables listed below</p>
                </div>
            </div>
            <Category title="Tone and Style" score={feedBack.toneAndStyle.score} />
            <Category title="Content" score={feedBack.content.score} />
            <Category title="Structure" score={feedBack.structure.score} />
            <Category title="Skills" score={feedBack.skills.score} />
        </div>
    )
}
export default Summary