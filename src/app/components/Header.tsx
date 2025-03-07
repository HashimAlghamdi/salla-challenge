"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { cart, resetCart } = useCart();

  const cartItemsCount = cart?.cartItems.length || 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    resetCart();
    router.push("/");
  };

  return (
    <header className="w-full bg-white z-50 shadow-sm">
      <div className="container">
        <div className="md:py-6 py-4">
          <div className="flex justify-between flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-col sm:flex-row items-center gap-4 relative">
              <Link
                href="/"
                className="block w-[80px] h-[80px] bg-gray-50 p-2 rounded-full border-4 border-secondary-50"
              >
                <img
                  src="https://cdn.salla.network/images/logo/logo-square.png"
                  alt="Logo"
                />
              </Link>
              <div className="flex flex-col">
                <h1 className="text-xl">متجر التجربة الجميلة</h1>
                <small className="text-gray-400">
                  متجرك لكل تجاربك وأفكارك الجميلة
                </small>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="w-[40px] h-[40px] rounded-full text-center flex items-center justify-center bg-secondary-50 text-primary hover:bg-secondary-50 hover:text-primary"
                  >
                    <i className="sicon-send-out"></i>
                  </button>
                  <Link
                    href="/cart"
                    className="w-[40px] h-[40px] rounded-full text-center flex items-center justify-center bg-secondary-50 text-primary relative"
                  >
                    <i className="sicon-shopping-bag"></i>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    type="button"
                    className="w-[40px] h-[40px] rounded-full text-center flex items-center justify-center bg-secondary-50 text-primary"
                  >
                    <i className="sicon-user"></i>
                  </Link>
                  <Link
                    href="/cart"
                    className="w-[40px] h-[40px] rounded-full text-center flex items-center justify-center bg-secondary-50 text-primary relative"
                  >
                    <i className="sicon-shopping-bag"></i>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
