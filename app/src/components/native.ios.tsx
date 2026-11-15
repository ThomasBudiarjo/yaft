import { DatePicker, Host, Picker, Text } from '@expo/ui/swift-ui';
import { datePickerStyle, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import * as Haptics from 'expo-haptics';

export interface Option<T extends string> {
  value: T;
  label: string;
}

/** UISegmentedControl through SwiftUI. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<NoInfer<T>>[];
  value: T;
  onChange(value: NoInfer<T>): void;
}) {
  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Picker
        modifiers={[pickerStyle('segmented')]}
        selection={value}
        onSelectionChange={(next: T) => {
          void Haptics.selectionAsync();
          onChange(next);
        }}>
        {options.map((o) => (
          <Text key={o.value} modifiers={[tag(o.value)]}>
            {o.label}
          </Text>
        ))}
      </Picker>
    </Host>
  );
}

/** The compact date and time buttons that open the system calendar and time wheel. */
export function DateTimeField({ title, value, onChange }: { title: string; value: Date; onChange(date: Date): void }) {
  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <DatePicker
        title={title}
        modifiers={[datePickerStyle('compact')]}
        selection={value}
        displayedComponents={['date', 'hourAndMinute']}
        onDateChange={onChange}
      />
    </Host>
  );
}
