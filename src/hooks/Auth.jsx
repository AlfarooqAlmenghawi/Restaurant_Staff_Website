import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { redirect } from "react-router-dom";
import { useSessionStorage } from "./useStorage";

const AuthContext = createContext({
  session: null,
  user: null,
  signOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [session, setSession] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useSessionStorage(
    "selectedRestaurant",
    null
  );

  const updateRestaurant = (restaurant_id) => {
    setSelectedRestaurant(restaurant_id);
    setSession((currSession) => {
      const updatedSession = { ...currSession };
      updatedSession.restaurant_id = restaurant_id;
      return updatedSession;
    });
  };

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      session && setSession({ ...session, restaurant_id: selectedRestaurant });
      setUser(session?.user);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        session
          ? setSession({ ...session, restaurant_id: selectedRestaurant })
          : setSession(session);
        setUser(session?.user);
        setLoading(false);
      }
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    updateRestaurant,
    signOut: async (shouldRedirect) => {
      const { error } = await supabase.auth.signOut();
      setSelectedRestaurant(null);
      if (error) setSession(null);
      shouldRedirect && redirect("/sign-in");
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
