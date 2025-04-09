import { Text, TextProps, StyleSheet } from 'react-native';

interface CustomTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
}

export const CustomText = ({ style, variant = 'body', ...props }: CustomTextProps) => {
  return (
    <Text style={[styles[variant], style]} {...props} />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  body: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  caption: {
    fontSize: 14,
    color: '#999999',
  },
}); 