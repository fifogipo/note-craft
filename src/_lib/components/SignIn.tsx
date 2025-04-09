'use client'

import { signIn } from 'next-auth/react'

const SignIn = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#1C1C1C]">
      <div className="shape flex flex-col flex-1 items-center justify-between p-8 rounded-lg bg-[#40E0D0] max-h-[800px] min-w-[250px] w-full max-w-[400px]">
        <div className="shape-diff"></div>
        <div className="shape-diff-2"></div>
        <div className="shape-diff-3"></div>
        <img src="/logo-big.svg" alt="logo node craft" />
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          type="submit" className="flex items-center gap-2 rounded-lg cursor-pointer px-4 py-2 justify-center w-full text-[#333333] bg-white"
        >
          <img loading="lazy" height="24" width="24" id="provider-logo" src="https://authjs.dev/img/providers/google.svg"  alt="logo google"/>
          <span>Login with Google</span>
        </button>
      </div>

    </div>
  )
}

export default SignIn