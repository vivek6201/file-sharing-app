export type Variants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export enum PlatformType {
  ANDROID = 'android',
  IOS = 'ios',
}

export type ResponsiveTextType = {
  variant?: Variants;
  fontSize?: number;
  color?: string;
  children: React.ReactNode;
  numberOfLines?: number;
  onLayout?: (event: any) => void;
  [key: string]: any;
};

export const fontSizeMap: Record<Variants, Record<PlatformType, number>> = {
  h1: {android: 24, ios: 22},
  h2: {android: 22, ios: 20},
  h3: {android: 20, ios: 18},
  h4: {android: 18, ios: 16},
  h5: {android: 16, ios: 14},
  h6: {android: 12, ios: 10},
};
