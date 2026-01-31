import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/libs/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import SEO from "~/components/SEO";

export const meta = () => {
  return [
    {
      title: "ResuAIze | Review",
    },
    { name: "description", content: "Detailed overview of you resume" },
  ];
};
const Resume = () => {
  const { id } = useParams();
  const { auth, isLoading, fs, kv } = usePuterStore();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const navigate = useNavigate();
  const [feedBack, setFeedBack] = useState<Feedback | null>(null);
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);
  useEffect(() => {
    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) {
          console.warn("No resume found for id:", id);
          return;
        }
        const data = JSON.parse(resume);
        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) {
          console.error("Resume blob is null");
          return;
        }
        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        const pdfReader = new FileReader();
        pdfReader.onerror = () =>
          console.error("PDF read error", pdfReader.error);
        pdfReader.onloadend = () => {
          const resumeDataUrl = pdfReader.result as string;
          if (resumeDataUrl) {
            console.log("Resume URL created");
            setResumeUrl(resumeDataUrl);
          } else {
            console.error("PDF data URL is empty");
          }
        };
        pdfReader.readAsDataURL(pdfBlob);

        const imageBlob = await fs.read(data.imagePath);
        if (!imageBlob) {
          console.error("Image blob is null");
          return;
        }
        const imgBlobFile = new Blob([imageBlob], { type: "image/png" });
        const imgReader = new FileReader();
        imgReader.onerror = () =>
          console.error("Image read error", imgReader.error);
        imgReader.onloadend = () => {
          const imgDataUrl = imgReader.result as string;
          if (imgDataUrl) {
            console.log("Image URL created");
            setImageUrl(imgDataUrl);
          } else {
            console.error("Image data URL is empty");
          }
        };
        imgReader.readAsDataURL(imgBlobFile);
        setFeedBack(data.feedBack);
      } catch (error) {
        console.error("Error loading resume:", error);
      }
    };
    loadResume();
  }, [id]);
  return (
    <main className={"pt-0!"}>
      <SEO
        title="Resume Feedback Report | AI Resume Summary & ATS Suggestions"
        description="View your AI-generated resume summary, ATS score insights, keyword improvements, and personalized job-winning feedback instantly."
        keywords="
          AI Resume Feedback,
          Resume Summary Generator,
          ATS Resume Report,
          Resume Improvement Suggestions,
          Resume Optimization Tool,
          AI Resume Review
        "
        url="https://resuaize.vercel.app/resume"
      />
      <nav className="resume-nav">
        <Link to={"/"} className={"back-button"}>
          <img src={"/icons/back.svg"} alt={"back"} className={"w-2.5 h-2.5"} />
          <span className={"text-gray-800 text-sm font-semibold"}>
            Back to home page
          </span>
        </Link>
      </nav>
      <div className={"flex flex-row w-full max-lg:flex-col-reverse"}>
        <section
          className={
            "feedback-section bg-cover bg-[url('/images/bg-small.svg')] h-screen sticky top-0 items-center justify-center"
          }
        >
          {imageUrl && resumeUrl && (
            <div
              className={
                "animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit"
              }
            >
              <a href={resumeUrl} target="_blank" rel="noreferrer">
                <img
                  src={imageUrl}
                  alt={"resume-image"}
                  className={"w-full h-full object-contain rounded-2xl"}
                  title={"resume"}
                  onError={(e) => console.error("Image failed to load:", e)}
                />
              </a>
            </div>
          )}
          {!imageUrl && resumeUrl && (
            <div className="p-4 text-red-600 text-center">
              <p>Failed to load image. Check console for details.</p>
            </div>
          )}
        </section>
        <section className={"feedback-section"}>
          <h2>Resume Review</h2>
          {feedBack ? (
            <div
              className={"flex flex-col gap-8 animate-in fade-in duration-1000"}
            >
              <Summary feedBack={feedBack} />
              <ATS score={feedBack.ATS.score || 0} suggestions={feedBack.ATS.tips || []} />
              <Details feedBack={feedBack} />
            </div>
          ) : (
            <img
              alt={"searching resume"}
              src={"/images/resume-scan-2.gif"}
              className={"w-full"}
            />
          )}
        </section>
      </div>
    </main>
  );
};
export default Resume;
