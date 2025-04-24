"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useSession } from "@/context/useSessionHook";
import { authCompanyAPI } from "@/services/authCompany";

// Define types for Google OAuth
interface GoogleOAuthResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

interface GoogleAccounts {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: GoogleOAuthResponse) => void;
    }) => {
      requestAccessToken: () => void;
    };
  };
}

declare global {
  interface Window {
    google: {
      accounts: GoogleAccounts;
    };
  }
}

const SocialLoginCompany = () => {
  const router = useRouter();
  const { setToken } = useSession();

  const handleGoogleLogin = async () => {
    try {
      // Initialize Google Sign-In
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        scope: "email profile",
        callback: async (response: GoogleOAuthResponse) => {
          if (response.access_token) {
            try {
              // Get user info using the access token
              const userInfoResponse = await fetch(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                  headers: { Authorization: `Bearer ${response.access_token}` },
                }
              );

              const userInfo: GoogleUserInfo = await userInfoResponse.json();

              // Make sure we have a valid sub (Google ID)
              if (!userInfo.sub) {
                throw new Error("Could not get Google user ID");
              }

              // Send the Google user ID and additional info to our backend
              const result = await authCompanyAPI.socialLoginCompany({
                googleId: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
              });

              // Use setToken to update session context with isCompany=true
              setToken(result.token, true);

              // Show success message
              await Swal.fire({
                title: "Success!",
                text: result.message,
                icon: "success",
                confirmButtonText: "OK",
              });

              // Redirect to company dashboard
              router.push("/company/dashboard");
            } catch (error: unknown) {
              if (error instanceof Error) {
                console.error("Google login error:", error);
                await Swal.fire({
                  title: "Error!",
                  text: error.message || "Login failed",
                  icon: "error",
                  confirmButtonText: "OK",
                });
              } else {
                await Swal.fire({
                  title: "Error!",
                  text: "Login failed",
                  icon: "error",
                  confirmButtonText: "OK",
                });
              }
            }
          }
        },
      });

      // Prompt Google Sign-In
      client.requestAccessToken();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Google login error:", error);
        await Swal.fire({
          title: "Error!",
          text: error.message || "Login failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        await Swal.fire({
          title: "Error!",
          text: "Login failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
    >
      <Image
        src="/google.png"
        alt="Google"
        width={20}
        height={20}
        className="mr-2"
      />
      Lanjutkan dengan Google
    </button>
  );
};

export default SocialLoginCompany;
