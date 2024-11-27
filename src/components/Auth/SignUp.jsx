import { Form, Link, redirect, useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";
import { ErrMsg } from "./ErrMsg";
import { useState } from "react";
import { BarLoader } from "react-spinners";

export const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.currentTarget[0].value;
    const password = e.currentTarget[1].value;
    const confirmPassword = e.currentTarget[2].value;

    if (password !== confirmPassword) {
      setLoading(false);
      setError({ code: "Passwords don't match" });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://localhost:5173.com/sign-in",
      },
    });
    if (error) {
      setLoading(false);
      setError(error);
      return;
    }

    navigate("/sign-in");
  };
  return (
    <div className="pt-[20vh] flex justify-center items-center">
      <Form method="post" onSubmit={handleSubmit} className="authForm">
        <h2 className="text-2xl">Staff Sign Up</h2>
        <div className="flex flex-col gap-4 w-full">
          {error?.code.startsWith("Passwords") && (
            <ErrMsg>The passwords you entered don't match</ErrMsg>
          )}
          {error?.code === "email_exists" && (
            <ErrMsg>
              The email you provided is already in use. Try{" "}
              <Link to="/sign-in">logging in</Link> instead
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
          <input
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="confirm password"
            className="authInput"
            required
          />
        </div>
        <button type="submit" className="authSubmit" disabled={loading}>
          {loading ? (
            <BarLoader color="white" className="my-3 mx-auto" />
          ) : (
            "Sign Up"
          )}
        </button>
      </Form>
    </div>
  );
};
