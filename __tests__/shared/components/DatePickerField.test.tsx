import {fireEvent, screen} from '@testing-library/react-native';
import {Platform} from 'react-native';
import DatePickerField from '../../../src/shared/components/DatePickerField';
import {renderWithTheme} from '../../test/renderWithTheme';

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const {Pressable: RNPressable, Text: RNText} = require('react-native');

  const DateTimePicker = ({
    onChange,
  }: {
    onChange?: (event: {type: string}, date?: Date) => void;
  }) =>
    React.createElement(
      RNPressable,
      {
        accessibilityRole: 'button',
        accessibilityLabel: 'Native date picker',
        onPress: () =>
          onChange?.({type: 'set'}, new Date('2026-01-15T08:30:00')),
      },
      React.createElement(RNText, null, 'picker'),
    );

  return {__esModule: true, default: DateTimePicker};
});

const setPlatform = (os: 'ios' | 'android') => {
  Object.defineProperty(Platform, 'OS', {get: () => os});
};

describe('DatePickerField', () => {
  const value = new Date('2026-09-22T14:05:00');

  beforeEach(() => {
    jest.useFakeTimers({now: value});
  });

  afterEach(() => {
    jest.useRealTimers();
    setPlatform('ios');
  });

  it('shows the formatted date and time', async () => {
    await renderWithTheme(
      <DatePickerField value={value} onChange={jest.fn()} />,
    );

    expect(screen.getByText(/Date & Time/)).toBeOnTheScreen();
    expect(screen.getByText(/^Today,/)).toBeOnTheScreen();
    expect(screen.getByText(/Logged at/)).toBeOnTheScreen();
    expect(screen.getByRole('button', {name: 'Pick date'})).toBeOnTheScreen();
  });

  it('applies an Android date pick and keeps the original time', async () => {
    setPlatform('android');
    const onChange = jest.fn();
    await renderWithTheme(<DatePickerField value={value} onChange={onChange} />);

    expect(screen.queryByRole('button', {name: 'Native date picker'})).toBeNull();

    await fireEvent.press(screen.getByRole('button', {name: 'Pick date'}));
    await fireEvent.press(
      screen.getByRole('button', {name: 'Native date picker'}),
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0] as Date;
    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(0);
    expect(next.getDate()).toBe(15);
    expect(next.getHours()).toBe(value.getHours());
    expect(next.getMinutes()).toBe(value.getMinutes());
  });

  it('confirms an iOS draft date from Done', async () => {
    setPlatform('ios');
    const onChange = jest.fn();
    await renderWithTheme(<DatePickerField value={value} onChange={onChange} />);

    await fireEvent.press(screen.getByRole('button', {name: 'Pick date'}));
    await fireEvent.press(
      screen.getByRole('button', {name: 'Native date picker'}),
    );
    await fireEvent.press(screen.getByText('Done'));

    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0] as Date;
    expect(next.getDate()).toBe(15);
    expect(next.getHours()).toBe(value.getHours());
  });

  it('cancels an iOS pick without changing the date', async () => {
    setPlatform('ios');
    const onChange = jest.fn();
    await renderWithTheme(<DatePickerField value={value} onChange={onChange} />);

    await fireEvent.press(screen.getByRole('button', {name: 'Pick date'}));
    await fireEvent.press(screen.getByText('Cancel'));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Done')).toBeNull();
  });
});
