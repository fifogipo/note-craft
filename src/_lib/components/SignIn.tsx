"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

const SignIn = () => {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-[100dvh] p-6 bg-background"
      role="main"
    >
      <div className="shape flex flex-col flex-1 items-center justify-between p-8 rounded-lg bg-accent max-h-[800px] min-w-[250px] w-full max-w-[400px]">
        <div className="shape-diff"></div>
        <div className="shape-diff-2"></div>
        <div className="shape-diff-3"></div>
        <Image
          src="/logo-big.svg"
          alt="Logo di Node Craft"
          width={150}
          height={137}
        />
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          type="button"
          className="flex items-center gap-2 rounded-lg cursor-pointer px-4 py-2 justify-center w-full text-[#333333] bg-white"
          aria-label="Accedi con Google"
        >
          <Image
            loading="lazy"
            height={24}
            width={24}
            id="provider-logo"
            src="https://authjs.dev/img/providers/google.svg"
            alt="Logo di Google"
          />
          <span>Login with Google</span>
        </button>
      </div>
    </main>
  );
};

export default SignIn;
