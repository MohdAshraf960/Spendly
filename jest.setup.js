import 'react-native-gesture-handler/jestSetup';

// ThemeProvider and repositories share one in-memory Realm. See __mock__/realm.ts.
jest.mock('./src/database/realm', () => require('./__mock__/realm'));

jest.mock(
  '@env',
  () => ({
    GOOGLE_WEB_CLIENT_ID: 'test-web-client-id',
  }),
  {virtual: true},
);

jest.mock(
  '@react-native-google-signin/google-signin',
  () => require('./__mock__/googleSignin'),
);

jest.mock('@react-native-vector-icons/ionicons/static', () => {
  const React = require('react');
  const {Text} = require('react-native');
  const Ionicons = ({name}) =>
    React.createElement(Text, null, name ?? 'icon');
  return {Ionicons};
});

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return {...mock, ...mock.default};
});

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const {View} = require('react-native');
  const DateTimePicker = () => React.createElement(View);
  return {
    __esModule: true,
    default: DateTimePicker,
    DateTimePickerAndroid: {open: jest.fn(), dismiss: jest.fn()},
  };
});
