import { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from "~/libs/puter";

const ResumeCard = ({ resume }: { resume: Resume }) => {
    const { fs } = usePuterStore();

    const [resumeUrl, setResumeUrl] = useState<string | null>(resume.imagePath);

    useEffect(() => {
        let objectUrl: string | null = null;
        const loadResume = async () => {
            try {
                const blob = await fs.read(resume.imagePath);
                if (blob instanceof Blob) {
                    objectUrl = URL.createObjectURL(blob);
                    setResumeUrl(objectUrl);
                }
            } catch (error) {
                // If fs.read fails, it might be a public asset or external URL, so we keep the initial/default value.
                // We can optionally log this as a debug message rather than an error if it's expected for some files.
                console.log("Providing fallback/public URL for image:", resume.imagePath);
            }
        };

        loadResume();
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [resume.imagePath]);
    return (
        <Link to={`/resume/${resume.id}`} className={"resume-card animate-in fade-in duration-1000"}>
            <div className={"resume-card-header"}>
                <div className={"flex flex-col gap-2"}>
                    <h2 className={"text-black! font-bold wrap-break-word"}>
                        {resume.companyName}
                    </h2>
                    <h3 className={"text-lg wrap-break-word text-gray-500"}>{resume.jobTitle}</h3>
                </div>
                <div className={"shrink-0"}>
                    <ScoreCircle score={resume.feedback?.overallScore || 0} />
                </div>
            </div>
            <div className={"gradient-border animate-in fade-in duration-1000"}>
                <div className={"w-full h-full "}>
                    <img src={resumeUrl || ""} alt={`${resume.companyName} resume`} className={"w-full object-cover h-87.5 max-sm:h-50 object-top"} />
                </div>
            </div>
        </Link>
    );
}
export default ResumeCard;