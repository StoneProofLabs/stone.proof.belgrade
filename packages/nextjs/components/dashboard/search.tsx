import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function Search({ onSearch, placeholder = "Search here..." }: SearchProps) {
  return (
    <div className="bg-[#2B2D2F] flex items-center rounded-md px-2 py-3">
      <SearchIcon size={18} className="text-gray-400" />
      <input
        className="bg-[#2B2D2F] focus:outline-none ml-3 text-[14px] text-white placeholder-gray-400 w-full"
        type="text"
        placeholder={placeholder}
        onChange={e => onSearch(e.target.value)}
      />
    </div>
  );
}
