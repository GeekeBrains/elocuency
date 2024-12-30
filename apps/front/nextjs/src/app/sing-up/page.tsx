import { EloFrontRoutesEnum } from 'elo/front/react/Shared';
import { EloApp } from 'elo/front/react/Components';

export default async function SingUpPage() {
  return <EloApp initialPage={EloFrontRoutesEnum.signUp} />;
}
