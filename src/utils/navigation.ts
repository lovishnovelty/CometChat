import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

class Navigation {
  navigationRef: any;

  constructor() {
    this.navigationRef = createNavigationContainerRef();
  }

  goBack = () => {
    this.navigationRef.current?.goBack();
  };

  navigate = (name: string, params?: any) => {
    this.navigationRef.navigate(name, params);
  };

  getCurrentRouteName = () => {
    return this.navigationRef.current?.getCurrentRoute();
  };

  replace = (name: string, params?: any) => {
    this.navigationRef.dispatch(StackActions.replace(name, params));
  };

  pop = () => {
    this.navigationRef.dispatch(StackActions.pop());
  };

  reset = ({
    index,
    routeName,
    params,
  }: {
    index: number;
    routeName: string;
    params?: any;
  }) => {
    this.navigationRef.reset({
      index,
      routes: [{name: routeName, params}],
    });
  };
}

export const navigation = new Navigation();
