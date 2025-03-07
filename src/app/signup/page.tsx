"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const Signup = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");

      if (password !== confirmPassword) {
        setError("كلمات المرور غير متطابقة");
        return;
      }

      setIsLoading(true);
  
      try {
        await authService.signup({ email, password, firstName, lastName });
        router.push('/login');
      } catch (err) {
        setError(
          err instanceof Error && "response" in err
            ? (err as any).response.data
            : "حدث خطأ أثناء إنشاء الحساب"
        );
      } finally {
        setIsLoading(false);
      }
    };
  return (
    <div className="sm:max-w-[700px] mx-auto">
      <div className="flex flex-col text-center items-center justify-center mb-6">
        <h2 className="text-lg">إنشاء حساب جديد</h2>
        <span className="text-xs text-gray-500">
          قم بإنشاء حساب للبدء في التسوق
        </span>
      </div>
      <ErrorMessage error={error} />
      <form method="post" action="#" className="flex flex-col w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-md" htmlFor="firstName">
            الاسم الأول
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            autoComplete="given-name"
            className="w-full p-2 bg-white appearance-none rounded-md border text-md"
            placeholder="الاسم الأول.."
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-md" htmlFor="lastName">
            اسم العائلة
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            autoComplete="family-name"
            className="w-full p-2 bg-white appearance-none rounded-md border text-md"
            placeholder="اسم العائلة.."
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-md" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
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
            id="password"
            autoComplete="new-password"
            className="w-full p-2 bg-white appearance-none rounded-md border text-md"
            placeholder="كلمة المرور.."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-md" htmlFor="confirmPassword">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            autoComplete="new-password"
            className="w-full p-2 bg-white appearance-none rounded-md border text-md"
            placeholder="تأكيد كلمة المرور.."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={
              isLoading || 
              !email || 
              !password || 
              !confirmPassword || 
              !firstName || 
              !lastName || 
              password !== confirmPassword
            }
            className="w-full bg-primary text-secondary p-2 text-md rounded-md flex items-center justify-center"
          >
            {isLoading ? <Loader className="w-5 h-5" /> : "إنشاء حساب"}
          </button>
          <div>
            <Link
              href="/login"
              className="text-primary underline p-2 text-md rounded-md"
            >
              لديك حساب بالفعل؟ تسجيل الدخول
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
