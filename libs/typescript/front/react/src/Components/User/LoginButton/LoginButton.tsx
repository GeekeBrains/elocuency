'use client';

import { useRouter } from 'next/navigation';

import { EloFrontRoutesEnum } from 'elo/front/react/Shared';

export const LoginButton = () => {
  const router = useRouter();

  function onClickLogin() {
    router.push(EloFrontRoutesEnum.login);
  }
  return (
    <div className="form-buttons">
      <button onClick={() => onClickLogin()}>Login</button>
    </div>
  );
};
