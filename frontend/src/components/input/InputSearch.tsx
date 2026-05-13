import { useEffect, useRef, useState } from "react";
import "./Input.css";

type Option = {
    id: string;
    title: string;
};

type SearchProps = {
    label: string;
    options: Option[];
    defaultValue?: string;
    onSelect: (option: Option) => void;
};

export default function SearchInput({ label, options, defaultValue, onSelect }:
    SearchProps) {
    const [search, setSearch] = useState(defaultValue || "");
    const [showList, setShowList] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const safeOptions = options || [];
    const filtered = search
        ? safeOptions.filter(opt =>
            opt.title.toLowerCase().includes(search.toLowerCase())
        )
        : safeOptions;

    useEffect(() => {
        setSearch(defaultValue || "");
    }, [defaultValue]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowList(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="input-group" id="search-input" ref={containerRef}>

            <input
                type="text"
                placeholder=" "
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setShowList(true);
                }}
                onFocus={() => setShowList(true)}
            />

            <label>{label}</label>

            {search && (
                <span className="search-button"
                    onClick={() => {
                        setSearch("");
                        setShowList(false);
                    }}
                >
                    ✖
                </span>
            )}

            {showList && (
                <div className="search-list">
                    {filtered.length > 0 ? (
                        filtered.map(opt => (
                            <div className="search-item"
                                key={opt.id}
                                onClick={() => {
                                    setSearch(opt.title);
                                    setShowList(false);
                                    onSelect(opt);
                                }}
                            >
                                {opt.title}
                            </div>
                        ))
                    ) : (
                        <div className="search-nothing">
                            Nenhum resultado
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}