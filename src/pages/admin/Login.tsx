import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
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

    const completeGoogleSignIn = async () => {
      try {
        const result = await getRedirectResult(auth);
        const user = result?.user || auth.currentUser;

        if (result) {
          await user.reload();
          if (isAuthorizedAdmin(user)) {
            navigate(redirectPath, { replace: true });
            return;
          }

          if (active) {
            setError(user.emailVerified
              ? "You are not allowed to access this page."
              : "Your Google email could not be verified. Please use a verified account.");
          }
          await signOut(auth);
        } else if (isAuthorizedAdmin(user)) {
          navigate(redirectPath, { replace: true });
        } else if (user) {
          // Clear a stale non-admin session without showing an access error before Google verification.
          await signOut(auth);
        }
      } catch {
        if (active) setError("Google sign-in could not be completed. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void completeGoogleSignIn();
    return () => { active = false; };
  }, [navigate, redirectPath]);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithRedirect(auth, provider);
    } catch (signInError) {
      const code = typeof signInError === "object" && signInError && "code" in signInError ? String(signInError.code) : "";
      if (code.includes("unauthorized-domain")) {
        setError("Google sign-in is not available on this website address. Please contact the administrator.");
      } else if (code.includes("operation-not-allowed")) {
        setError("Google sign-in is not enabled in Firebase Authentication.");
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
