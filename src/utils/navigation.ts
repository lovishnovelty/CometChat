import {createNavigationContainerRef} from '@react-navigation/native';

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
    this.navigationRef.current?.getCurrentRoute();
  };
}

export const navigation = new Navigation();
