import {StyleSheet} from 'react-native';
import {SizeConfig} from '../../config';

export const incomingCallScreenStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    width: 60,
    marginVertical: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SizeConfig.screenWidth * 0.7,
  },
  iconContainer: {
    borderRadius: 50,
    padding: 10,
    marginBottom: 10,
  },
  answerContainer: {
    backgroundColor: 'green',
  },
  declineContainer: {
    backgroundColor: 'red',
  },
});
