import "./Row.scss";

import Cell from "../Cell/Cell";

type RowProps = {
    row: [string, string, string, string, string];
    styles: string[];
}

export default function Row({ row, styles }: RowProps) {
    return <div className="row">
        {row.map((letter: string, index: number) => (
            <Cell value={letter} key={index} style={styles[index]} />
        ))}
    </div>;
}