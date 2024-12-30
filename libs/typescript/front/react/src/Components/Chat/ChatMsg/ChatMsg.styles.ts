import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MsgTypeEnum } from './ChatMsg';

const USER_COLOR = '#b1e9ff9c';
const BOT_COLOR = '#fffdecc7';

export const ChatMsgContainer = styled(motion.div)<{
  userType: MsgTypeEnum;
  hidden: boolean;
}>`
  initial={{ scale: 0 }}
  animate={{ rotate: 360, scale: 1 }}
  transition={{
    type: 'spring',
    stiffness: 260,
    damping: 20,
  }}

  font-size: ${(props) => (props.hidden ? '30px' : '15px')};
  background-color: ${(props) =>
    props.userType === MsgTypeEnum.user ? USER_COLOR : BOT_COLOR};
  align-self: ${(props) =>
    props.userType === MsgTypeEnum.user ? 'flex-end' : 'flex-start'};
`;

export const ChatMsgUserContainer = styled.div`
  font-size: 10px;
  font-weight: bold;
  border-radius: 10px;
  border: 1px solid white;
  padding: 0 10px 0 10px;
  background: white;
  margin-top: -19px;
  width: fit-content;
  margin-left: -18px;
`;
