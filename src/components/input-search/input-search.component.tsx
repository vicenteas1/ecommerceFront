import { useState } from "react";
import type { InputBuscadorProps } from "../../models/components/input-search/input-search.model";

export default function InputBuscador({
  onSearch,
  initialValue = "",
  placeholder = "Por ejemplo: Santiago, Chile",
  buttonLabel = "Buscar",
  disabled = false,
}: InputBuscadorProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    onSearch(value);
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="btn btn-primary" disabled={disabled}>
        {buttonLabel}
      </button>
    </form>
  );
}
