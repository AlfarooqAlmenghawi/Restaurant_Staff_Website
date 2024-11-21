import { Form, Link, redirect, useActionData } from "react-router-dom";
import supabase from "../../../supabaseClient";

export const SignUp = () => {
  const returnedData = useActionData();
  return (
    <Form method="post" action="/sign-up">
      {returnedData?.error.startsWith("Passwords") && (
        <p>Error: {returnedData.error}</p>
      )}
      {returnedData?.error.code === "email_exists" && (
        <p>
          The email you provided is already in use. Try{" "}
          <Link to="/sign-in">logging in</Link> instead
        </p>
      )}
      <label htmlFor="email" />
      <input name="email" id="email" type="email" required />
      <label htmlFor="password" />
      <input name="password" id="password" type="password" required />
      <label htmlFor="confirmPassword" />
      <input
        name="confirmPassword"
        id="confirmPassword"
        type="password"
        required
      />
      <button type="submit">Submit</button>
    </Form>
  );
};

export const signUpAction = async ({ request }) => {
  const submittedData = await request.formData();
  console.log("something");
  if (submittedData.get("password") !== submittedData.get("confirmPassword"))
    return { error: "Passwords don't match" };
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

  return redirect("sign-in");
};
