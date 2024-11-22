import supabase from "../../../supabaseClient";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../hooks/Auth";

export const SignIn = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirectPath")?.replace("%2F", "/");
  const { session } = useAuth;
  const returnedFormData = useActionData();
  if (session) redirect(redirectPath);
  return (
    <Form method="post" action="/sign-in">
      {returnedFormData?.error.code === "invalid_credentials" && (
        <p>Invalid credentials. Please check your details and try again.</p>
      )}
      {returnedFormData?.error.code === "email_not_confirmed" && (
        <p>
          You haven't confirmed your email address yet. Please check your inbox
          or junk folder for an email asking you to confirm your account.
        </p>
      )}
      <label htmlFor="email" />
      <input
        name="email"
        id="email"
        type="email"
        placeholder="email"
        required
      />
      <label htmlFor="password" />
      <input
        name="password"
        id="password"
        type="password"
        placeholder="password"
        required
      />
      <input name="redirectPath" readOnly hidden value={redirectPath} />
      <button type="submit">Sign In</button>
      <p>
        Don't have an account yet?{" "}
        <Link to="/sign-up">
          <em>Sign up here</em>
        </Link>
      </p>
    </Form>
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
