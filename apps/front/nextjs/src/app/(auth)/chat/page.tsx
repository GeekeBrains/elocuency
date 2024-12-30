import { EloFrontRoutesEnum } from 'elo/front/react/Shared';
import { EloApp } from 'elo/front/react/Components';

export default function ChatPage() {
  return <EloApp initialPage={EloFrontRoutesEnum.chat} />;
}
