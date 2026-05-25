import { XIcon } from "@/components/icons/x-icon";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

export type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  description?: string;
  error?: boolean;
  suffix?: string;
  keyboardType?: TextInputProps["keyboardType"];
  returnKeyType?: TextInputProps["returnKeyType"];
  onEndEditing?: () => void;
  maxLength?: number;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      label,
      value,
      onChangeText,
      placeholder,
      description,
      error = false,
      suffix,
      keyboardType,
      returnKeyType = "done",
      onEndEditing,
      maxLength,
    },
    forwardedRef,
  ): React.JSX.Element => {
    const localRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    useImperativeHandle(forwardedRef, () => localRef.current!);

    const showClear = (isFocused || error) && value.length > 0;

    const handleClear = useCallback((): void => {
      onChangeText("");
      requestAnimationFrame(() => localRef.current?.focus());
    }, [onChangeText]);

    const borderClass = error
      ? "border-status-negative-normal"
      : isFocused
        ? "border-line-primary"
        : "border-line-subtle";

    return (
      <View className="gap-2">
        <Text className="text-label-subtle typo-body-2-normal-semi-bold">
          {label}
        </Text>
        <View
          className={`h-12 flex-row items-center rounded-[10px] border ${borderClass} bg-fill-normal px-3`}
        >
          <TextInput
            ref={localRef}
            className="flex-1 text-label-normal typo-body-1-reading-regular"
            placeholder={placeholder}
            placeholderTextColor="#73798c"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onEndEditing={onEndEditing}
            maxLength={maxLength}
          />
          {showClear ? (
            <Pressable onPressIn={handleClear}>
              <XIcon size={20} color="#1a1b1f" />
            </Pressable>
          ) : suffix ? (
            <Text className="text-label-subtler typo-body-1-reading-regular">
              {suffix}
            </Text>
          ) : null}
        </View>
        {description && (
          <Text
            className={
              error
                ? "text-status-negative-normal typo-caption-1-regular"
                : "text-label-subtler typo-caption-1-regular"
            }
          >
            {description}
          </Text>
        )}
      </View>
    );
  },
);

TextField.displayName = "TextField";
