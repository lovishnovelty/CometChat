import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {CustomDivider} from '../components';
import {APP_ROUTES} from '../constants';
import {globalStyles} from '../styles';
import {navigation} from '../utils';
import {joinSession, useAppDispatch} from '../redux';
import {Formik} from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  sessionId: yup.string().required(),
  sessionName: yup.string().required(),
});

const groupDetails: {
  adminIds: string[];
  moderatorIds: string[];
  participantIds: string[];
  banMembers: string[];
} = {
  adminIds: ['eoix3', 'dsoex'],
  moderatorIds: [],
  participantIds: [],
  banMembers: [],
};

export const JoinSessionCall = () => {
  const dispatch = useAppDispatch();
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>Join a call using session ID</Text>
      <CustomDivider />
      <Formik
        initialValues={{sessionId: '', sessionName: ''}}
        validationSchema={validationSchema}
        onSubmit={({sessionId, sessionName}) => {
          dispatch(joinSession(sessionId));
          navigation.navigate(APP_ROUTES.sessionCall, {
            groupDetails: {
              groupId: sessionId,
              groupName: sessionName,
              ...groupDetails,
            },
          });
        }}>
        {({values, handleChange, submitForm, errors}) => (
          <>
            <Text style={globalStyles.heading}>Session ID</Text>
            <TextInput
              value={values.sessionId}
              onChangeText={handleChange('sessionId')}
              style={globalStyles.textInput}
            />
            <CustomDivider />
            <Text style={globalStyles.heading}>Session Name</Text>
            <TextInput
              value={values.sessionName}
              onChangeText={handleChange('sessionName')}
              style={globalStyles.textInput}
            />
            {Object.values(errors).length ? (
              <Text style={{color: 'red', marginBottom: 10}}>
                All fields required
              </Text>
            ) : (
              <></>
            )}
            <Button title="Join" color={'coral'} onPress={submitForm} />
          </>
        )}
      </Formik>

      <CustomDivider />
    </View>
  );
};
