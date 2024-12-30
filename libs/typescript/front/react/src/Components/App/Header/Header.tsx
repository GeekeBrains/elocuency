import ChatSelector from '../../Chat/ChatSelector/ChatSelector';
import { Menu } from '../Menu';

export function Header() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: '0px',
        width: '100%',
      }}
    >
      <Menu />
      <ChatSelector />
    </div>
  );
}
