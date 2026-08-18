import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRedirectResult, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { isAuthorizedAdmin } from "@/lib/adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const redirectPath = location.state?.from?.pathname || "/admin";
  useEffect(() => {
    let active = true;

    const timeout = setTimeout(() => {
      if (active && loading) {
        setLoading(false);
        setError("Firebase connection is taking longer than usual. You may have an adblocker blocking the connection.");
      }
    }, 8000);

    const checkExistingSession = async () => {
      try {
        const user = auth.currentUser;
        if (isAuthorizedAdmin(user)) {
          navigate(redirectPath, { replace: true });
        } else if (user) {
          await signOut(auth);
        }
      } catch {
        // ignore
      }
    };
    
    // Firebase auth state observer to catch current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (isAuthorizedAdmin(user)) {
          navigate(redirectPath, { replace: true });
        } else {
          signOut(auth);
          if (active) setError("You are not allowed to access this page.");
        }
      }
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [navigate, redirectPath]);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      if (isAuthorizedAdmin(user)) {
        navigate(redirectPath, { replace: true });
      } else {
        await signOut(auth);
        setError("You are not allowed to access this page. Please use the correct admin email.");
      }
    } catch (signInError) {
      const code = typeof signInError === "object" && signInError && "code" in signInError ? String(signInError.code) : "";
      if (code.includes("unauthorized-domain")) {
        setError("Google sign-in is not available on this website address. Please contact the administrator.");
      } else if (code.includes("operation-not-allowed")) {
        setError("Google sign-in is not enabled in Firebase Authentication.");
      } else if (code.includes("popup-closed-by-user")) {
        setError("Sign-in popup was closed before completing. Please try again.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-4">
      <Button
        type="button"
        variant="outline"
        className="h-16 w-16 rounded-2xl border-slate-200 bg-white p-0 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
        disabled={loading}
        onClick={handleGoogleSignIn}
        aria-label="Sign in with authorized Google account"
      >
        <img src="/images/google-g.svg" alt="" aria-hidden="true" className={`h-7 w-7 ${loading ? "animate-pulse" : ""}`} />
      </Button>
      {error && <p className="max-w-xs text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
