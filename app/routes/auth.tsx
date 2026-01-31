import { usePuterStore } from "~/libs/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import SEO from "~/components/SEO";
export const meta = () => {
    return [
        {
            title: "ResuAIze | Auth",
        },
        {
            name: "description", content: "Log into your account"
        }
    ]
}
const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const loacation = useLocation();
    const next = loacation.search.split('next=')[1];
    const navigate = useNavigate();
    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])
    return (
        <main className={"bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center"}>
            <SEO
                title="Login | ResuAIze AI Resume Analyzer"
                description="Login or create an account to access your AI resume analysis, ATS score reports, and personalized feedback."
                keywords="Resume Analyzer Login, ResuAIze Account, AI Resume Tool Access"
                url="https://resuaize.vercel.app/auth"
            />
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className={"gradient-border shadow-lg"}>
                <section className={"flex flex-col gap-8 bg-white rounded-2xl p-10"}>
                    <div className={"flex flex-col items-center gap-2 text-center"}>
                        <h1>Welcome</h1>
                        <h2>Log In to Continue your Job Journey</h2>
                    </div>
                    {isLoading ? (
                        <button className={"auth-button animate-pulse"}>
                            <p>Signing you in.....</p>
                        </button>
                    ) : <>{auth.isAuthenticated ? (<button className={"auth-button"} onClick={auth.signOut}><p>Log Out</p></button>) : <button className={"auth-button"} onClick={auth.signIn}><p>Sign In</p></button>}</>}
                </section>
            </div>
        </main>
    )
}
export default Auth;