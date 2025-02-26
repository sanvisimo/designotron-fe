"use server";

import { redirect } from "next/navigation";
import { SigninFormSchema, FormState } from "@/app/lib/definitions";
import { createSession } from "@/app/lib/session";

export async function signin(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { email, password } = validatedFields.data;

  if (email !== "admin@admin.com" && password !== "admin") {
    return {
      message: "user o password errati",
    };
  }

  await createSession(email, password);
  // 5. Redirect user
  redirect("/dashboard");
}
