import type { CSSProperties, ReactNode } from "react";
import "./Table.css";

type DataTableCell = {
    content: ReactNode;
    colSpan?: number;
    rowSpan?: number;
    className?: string;
    style?: CSSProperties;
};

type DataTableProps = {
    columns: ReactNode[];
    rows: Array<Array<ReactNode | DataTableCell | null>>;
    emptyMessage?: string;
    className?: string;
};

function isDataTableCell(cell: ReactNode | DataTableCell | null): cell is DataTableCell {
    return (
        typeof cell === "object" &&
        cell !== null &&
        "content" in cell
    );
}

export default function DataTable({
    columns,
    rows,
    emptyMessage = "Nenhum registro encontrado.",
    className = "",
}: DataTableProps) {
    return (
        <table className={`table-data ${className}`.trim()}>
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.length > 0 ? (
                    rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => {
                                if (cell === null) return null;

                                if (isDataTableCell(cell)) {
                                    return (
                                        <td
                                            key={cellIndex}
                                            colSpan={cell.colSpan}
                                            rowSpan={cell.rowSpan}
                                            className={cell.className}
                                            style={cell.style}
                                        >
                                            {cell.content}
                                        </td>
                                    );
                                }

                                return <td key={cellIndex}>{cell}</td>;
                            })}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="table-empty">
                            {emptyMessage}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
