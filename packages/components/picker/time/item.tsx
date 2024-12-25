import classNames from "classnames";

export default function Items(props) {
	const { items = [], active, renderItem, unit, onClick } = props;

	return items.map((n) => {
		const isActive = n === active;

		return (
			<a
				key={n}
				className={classNames("i-timepicker-item", {
					"i-timepicker-item-active": isActive,
				})}
				onClick={() => onClick(n)}
			>
				{renderItem?.(n, isActive, unit) ?? (n < 10 ? `0${n}` : n)}
			</a>
		);
	});
}
