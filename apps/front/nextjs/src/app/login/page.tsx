import { EloFrontRoutesEnum } from 'elo/front/react/Shared';
import { EloApp } from 'elo/front/react/Components';

export default async function LoginPage() {
  return <EloApp initialPage={EloFrontRoutesEnum.login} />;
}
