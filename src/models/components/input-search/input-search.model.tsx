export type InputBuscadorProps = {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
};
