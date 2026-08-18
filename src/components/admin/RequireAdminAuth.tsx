import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAuthorizedAdmin } from "@/lib/adminAuth";

export default function RequireAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (active) {
        setUser(currentUser);
        setLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (active && loading) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      active = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking login...
      </div>
    );
  }

  if (!isAuthorizedAdmin(user)) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
