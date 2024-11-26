import supabase from "../../../supabaseClient";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { ErrMsg } from "./ErrMsg";

export const SignIn = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirectPath")?.replace("%2F", "/");
  const { session } = useAuth;
  const returnedFormData = useActionData();
  if (session) redirect(redirectPath);
  return (
    <div className="pt-[20vh] flex justify-center items-center">
      <Form method="post" action="/sign-in" className="authForm">
        <h2 className="text-2xl">Staff Sign In</h2>
        <div className="flex flex-col gap-4 w-full">
          {returnedFormData?.error.code === "invalid_credentials" && (
            <ErrMsg>
              Invalid credentials. Please check your details and try again.
            </ErrMsg>
          )}
          {returnedFormData?.error.code === "email_not_confirmed" && (
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
          <input name="redirectPath" readOnly hidden value={redirectPath} />
        </div>
        <button type="submit" className="authSubmit">
          Sign In
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

export const signInAction = async ({ request }) => {
  const data = await request.formData();
  const redirectPath = data.get("redirectPath");
  const submission = {
    email: data.get("email"),
    password: data.get("password"),
  };
  const { error } = await supabase.auth.signInWithPassword(submission);
  if (error) return { error, clearForm: true };

  return redirect(redirectPath || "/tables");
};
