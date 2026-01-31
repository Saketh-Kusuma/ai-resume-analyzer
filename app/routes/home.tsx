import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/libs/puter";
import { Helmet } from "react-helmet";
import SEO from "~/components/SEO";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ResuAIze" },
    { name: "description", content: "AI-powered resume analyzer that instantly evaluates your CV, highlights strengths, detects gaps, and provides smart improvement suggestions for better job matching." },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map(resume => JSON.parse(resume.value) as Resume)
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
      console.log(parsedResumes);
    };
    loadResumes();
  }, []);
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Helmet>
      <title>ResuAIze</title>
      <meta name="description" content="AI-powered resume analyzer that instantly evaluates your CV, highlights strengths, detects gaps, and provides smart improvement suggestions for better job matching." />
    </Helmet>
    <SEO
      title="ResuAIze | Free ATS Resume Score & Resume Feedback Tool"
      description="ResuAIze is the best AI Resume Analyzer to check ATS score, optimize resume keywords, and get instant job-winning feedback."
      keywords="AI Resume Analyzer, ATS Resume Checker, Resume Score Tool, Resume Feedback AI, Resume Keyword Optimization"
      url="https://resuaize.vercel.app/"
    />

    <Navbar />
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes.length === 0 ? (
          <h2>No resumes found. Upload your first resume to get started.</h2>
        ) : (
          <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      {loadingResumes && (
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-200px" alt="loading" />
        </div>
      )}
      {!loadingResumes && resumes.length > 0 && (
        <div className={"resumes-section"}>
          {resumes.map((item) => (
            <ResumeCard key={item.id} resume={item} />
          ))}
        </div>
      )}
      {!loadingResumes && resumes.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <Link to={"/upload"} className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
        </div>
      )}
    </section>
  </main>;
}
