import supabase from "../../../supabaseClient";
import {
  Form,
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { ErrMsg } from "./ErrMsg";
import { BarLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SignIn = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirectPath")?.replace("%2F", "/");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const hasRedirected = useLocation().state?.hasRedirected;

  useEffect(() => {
    hasRedirected &&
      toast.error("Sorry, you need to sign in to access that page");
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const submission = {
      email: e.currentTarget[0].value,
      password: e.currentTarget[1].value,
    };
    const { error } = await supabase.auth.signInWithPassword(submission);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate(redirectPath || "/my-restaurants");
    }
  };

  return (
    <div className="pt-[20vh] flex justify-center items-center">
      <Form method="post" onSubmit={handleSubmit} className="authForm">
        <h2 className="text-2xl">Staff Sign In</h2>
        <div className="flex flex-col gap-4 w-full">
          {error?.code === "invalid_credentials" && (
            <ErrMsg>
              Invalid credentials. Please check your details and try again.
            </ErrMsg>
          )}
          {error?.code === "email_not_confirmed" && (
            <ErrMsg>
              You haven't confirmed your email address yet. Please check your
              inbox or junk folder for an email asking you to confirm your
              account.
            </ErrMsg>
          )}
          <input
            name="email"
            id="email"
            type="email"
            placeholder="email"
            className="authInput"
            required
          />
          <input
            name="password"
            id="password"
            type="password"
            placeholder="password"
            className="authInput"
            required
          />
        </div>
        <button type="submit" className="authSubmit" disabled={loading}>
          {loading ? (
            <BarLoader color="white" className="my-3 mx-auto" />
          ) : (
            "Sign In"
          )}
        </button>
        <p>
          Don't have an account yet?{" "}
          <Link to="/sign-up" className="underline text-secondary">
            Sign up
          </Link>{" "}
          here
        </p>
      </Form>
    </div>
  );
};
