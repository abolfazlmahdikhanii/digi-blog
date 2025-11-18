import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import usersModel from "@/models/users";
import React from "react";

const UserInfo = () => {
  return <div></div>;
};

export default UserInfo;

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  await connectToDB();
  if (!token) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const validToken = verifyToken(token);
  if (!validToken) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const user = await usersModel.findOne({ email: validToken.email });
  if (!user) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    redirect: {
      destination: `@${user.username}`,
    },
  };
}
