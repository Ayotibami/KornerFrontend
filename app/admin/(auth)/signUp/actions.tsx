"use server";

const signUp = async (formdata: FormData) => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/admin/signup", {
      method: "POST",
      body: formdata,
    });
    const data = await res.json();
    console.log(data, "peri");
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

export default signUp;
