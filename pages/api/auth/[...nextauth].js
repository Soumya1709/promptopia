import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from "@/utils/database";
import User from "@/models/user.js";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      } catch (err) {
        console.error("Error fetching user in session callback:", err);
      }
      return session;
    },
    async signIn({ profile }) {
  try {
    await connectToDB();

    const userExists = await User.findOne({ email: profile.email });
    if (userExists) return true;

    // Step 1: Create base username (only alphanumeric)
    let base = profile.name
      ? profile.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
      : profile.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Step 2: Ensure minimum length 8
    if (base.length < 8) {
      base = base + Math.random().toString(36).substring(2, 8);
    }

    base = base.substring(0, 20);

    // Step 3: Ensure uniqueness
    let username = base;
    let counter = 1;

    while (await User.findOne({ username })) {
      username = base.substring(0, 18) + counter;
      counter++;
    }

    await User.create({
      email: profile.email,
      username,
      image: profile.picture,
    });

    return true;
  } catch (error) {
    console.error("Error checking if user exists: ", error.message);
    return false;
  }
}
  },
  secret: process.env.NEXTAUTH_SECRET,
});

