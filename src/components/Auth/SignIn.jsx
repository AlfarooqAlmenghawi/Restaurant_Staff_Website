import supabase from "../../../supabaseClient";
import {
  Form,
  redirect,
  useActionData,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { isAuthError } from "@supabase/supabase-js";

export const SignIn = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirectPath")?.replace("%2F", "/");
  const { session } = useAuth;
  const { error, clearForm } = useActionData;
  if (session) redirect(redirectPath);
  return (
    <Form method="post" action="/sign-in">
      {isAuthError(error) && error.code === "invalid_credentials" && (
        <p>Invalid credentials. Please check your details and try again.</p>
      )}
      <label htmlFor="email" />
      <input name="email" id="email" type="email" required />
      <label htmlFor="password" />
      <input
        name="password"
        id="password"
        type="password"
        value={clearForm && ""}
        required
      />
      <input name="redirectPath" readOnly hidden value={redirectPath} />
      <button type="submit">Submit</button>
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
