"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ApiError } from "@/interfaces/ApiError";

// Create a separate component for the login form content
const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const productId = searchParams.get("productId");
  const quantity = searchParams.get("quantity");

  const { login } = useAuth();
  const { addToCart } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);

      // If there's a product to add to cart
      if (productId) {
        await addToCart(Number(productId), Number(quantity) || 1);
      }

      router.replace(decodeURIComponent(redirectPath));
    } catch (err) {
      setError(
        err instanceof Error && "response" in err
          ? (err as ApiError).response.data
          : "حدث خطأ أثناء تسجيل الدخول"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<Loader className="w-1/4 h-[60vh]" />}>
      <div className="sm:max-w-[700px] mx-auto">
        <div className="flex flex-col text-center items-center justify-center mb-6">
          <h2 className="text-lg">تسجيل الدخول</h2>
          <span className="text-xs text-gray-500">
            قم بتسجيل الدخول لمتابعة التسوق
          </span>
        </div>
        <ErrorMessage error={error} />
        <form
          method="post"
          action="#"
          className="flex flex-col w-full"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block mb-2 text-md" htmlFor="username">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="true"
              className="w-full p-2 bg-white appearance-none rounded-md border text-md"
              placeholder="البريد الإلكتروني.."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-md" htmlFor="password">
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              autoComplete="true"
              id="password"
              className="w-full p-2 bg-white appearance-none rounded-md border text-md"
              placeholder="كلمة المرور.."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={`w-full bg-primary text-secondary p-2 text-md rounded-md flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? <Loader className="w-5 h-5" /> : "دخول"}
            </button>
            <div>
              <Link
                href="/signup"
                className="text-primary underline p-2 text-md rounded-md"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Suspense>
  );
};

export default Login;
