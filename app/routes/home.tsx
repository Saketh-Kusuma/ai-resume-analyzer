import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import {usePuterStore} from "~/libs/puter";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuAIze" },
    { name: "description", content: "AI-powered resume analyzer that instantly evaluates your CV, highlights strengths, detects gaps, and provides smart improvement suggestions for better job matching." },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const {isLoading, auth} = usePuterStore();
  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
  <section className="main-section">
    <div className="page-heading py-16">
      <h1>Track Your Applications & Resume Ratings</h1>
      <h2>Review your submissions and check AI-powered feedback.</h2>
    </div>
    {resumes.length>0&&(
        <div className={"resumes-section"}>
          {resumes.map((item) => (
              <ResumeCard key={item.id} resume={item}/>
          ))}
        </div>
    )}
  </section>
  </main>;
}
