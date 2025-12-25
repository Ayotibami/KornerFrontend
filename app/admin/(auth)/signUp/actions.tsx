"use server";

import { error } from "console";
import { redirect } from "next/navigation";

const signUp = async (formdata: FormData) => {
  let isSuccessful;
  try {
    const res = await fetch("http://localhost:3000/api/v1/admin/signup", {
      method: "POST",
      body: formdata,
    });
    const data = await res.json();

    if (!data.success) {
      isSuccessful = false;
      return { error: data.message };
    } else {
      isSuccessful = true;
    }
  } catch (error) {
    isSuccessful = false;
    return { error: "Something went wrong abeg." };
  }
  if (isSuccessful) {
    redirect("/admin/login");
  }
};

export default signUp;
