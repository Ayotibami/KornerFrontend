import Input from "@/components/ui/Input";
import React from "react";

export default function page() {
  return (
    <div>
      <form action="">
        <Input name=" name" label="Name"></Input>
        <Input label="Email" name="email" type="email"></Input>
        <Input label="Password" name="password" type="password"></Input>
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
        ></Input>
        <Input type="file" label="Avatar" name="avatar"></Input>
      </form>
    </div>
  );
}
