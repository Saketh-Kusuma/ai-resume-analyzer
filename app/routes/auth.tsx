import {usePuterStore} from "~/libs/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => {
    return [
        {
            title: "ResuAIze | Auth",
        },
        {
            name: "description", content:"Log into your account"
        }
    ]
}
const Auth = () => {
    const {isLoading, auth} = usePuterStore();
    const loacation = useLocation();
    const next  = loacation.search.split('next=')[1];
    const navigate = useNavigate();
    useEffect(()=>{
    if(auth.isAuthenticated) navigate(next);
    },[auth.isAuthenticated,next])
    return (
        <main className={"bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center"}>
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
                    ):<>{auth.isAuthenticated?(<button className={"auth-button"} onClick={auth.signOut}><p>Log Out</p></button>):<button className={"auth-button"} onClick={auth.signIn}><p>Sign In</p></button>}</>}
                </section>
            </div>
        </main>
    )
}
export default Auth;