import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { CustomText } from './CustomText';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomInput = ({ label, error, style, ...props }: CustomInputProps) => {
  return (
    <View style={styles.container}>
      {label && <CustomText variant="caption" style={styles.label}>{label}</CustomText>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#666666"
        {...props}
      />
      {error && <CustomText variant="caption" style={styles.error}>{error}</CustomText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 4,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  error: {
    color: '#E50914',
    marginTop: 4,
  },
}); 