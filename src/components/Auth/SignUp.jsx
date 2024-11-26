import { Form, Link, redirect, useActionData } from "react-router-dom";
import supabase from "../../../supabaseClient";
import { ErrMsg } from "./ErrMsg";

export const SignUp = () => {
  const returnedData = useActionData();
  return (
    <div className="pt-[20vh] flex justify-center items-center">
      <Form method="post" action="/sign-up" className="authForm">
        <h2 className="text-2xl">Staff Sign Up</h2>
        <div className="flex flex-col gap-4 w-full">
          {returnedData?.error.code.startsWith("Passwords") && (
            <ErrMsg>The passwords you entered don't match</ErrMsg>
          )}
          {returnedData?.error.code === "email_exists" && (
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
        <button type="submit" className="authSubmit">
          Sign Up
        </button>
      </Form>
    </div>
  );
};

export const signUpAction = async ({ request }) => {
  const submittedData = await request.formData();
  if (submittedData.get("password") !== submittedData.get("confirmPassword"))
    return { error: { code: "Passwords don't match" } };
  const submission = {
    email: submittedData.get("email"),
    password: submittedData.get("password"),
  };

  const { data, error } = await supabase.auth.signUp({
    ...submission,
    options: {
      emailRedirectTo: "https://localhost:5173.com/sign-in",
    },
  });
  if (error) return { error };

  return redirect("/my-restaurants");
};
