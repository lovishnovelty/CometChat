import {StyleSheet} from 'react-native';
import normalize from 'react-native-normalize';

export const customAppBarStyles = StyleSheet.create({
  appbarContainer: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: 'white',
  },

  dashboardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  dashboardAction: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 0.2,
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leading: {
    flex: 0.3,
    marginTop: 5,
  },
  actionsContainer: {
    flex: 0.3,
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  action: {
    paddingLeft: 12,
  },
  textTitle: {
    textAlignVertical: 'center',
    alignSelf: 'center',
    fontSize: normalize(20),
    color: 'black',
  },
});
