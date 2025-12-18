const signUp = (formdata: FormData) => {
  const name = formdata.get("name");
  const email = formdata.get("email");
  const password = formdata.get("password");
  const confirmPassword = formdata.get("confirmPassword");
  const avatar = formdata.get("avatar");
};
