import {chatService} from '../services';
import {navigation} from '../utils';
import {CallScreen} from './callScreen';

export const DirectCallScreen = ({route}: any) => {
  const {sessionID} = route.params;
  const getSettings = () => {
    return chatService.joinCall({
      sessionID: sessionID ?? 'abc',
      onCallEnded: navigation.pop,
    });
  };

  return <CallScreen callSettings={getSettings()} />;
};
