import { EloApp } from 'elo/front/react/Components';
import { EloFrontRoutesEnum } from 'elo/front/react/Shared';

export default async function ChatPage() {
  return <EloApp initialPage={EloFrontRoutesEnum.user} />;
}
