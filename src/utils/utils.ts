'use server';
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const getCurrUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('userToken')?.value;

    if (!token) {
      return null;
    }
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    // console.log(payload);
    
    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('userToken');
  } catch (error) {
    console.error("Error deleting token:", error);
  }
}