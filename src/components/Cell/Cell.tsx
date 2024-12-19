import "./Cell.scss";

type CellProps = {
  value: string;
  style: string;
};

export default function Cell({ value, style }: CellProps) {
  return <div className={`cell ${style}`}>{value}</div>;
}
