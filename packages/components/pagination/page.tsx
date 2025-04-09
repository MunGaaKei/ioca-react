import classNames from "classnames";
import { useState } from "react";
import Loading from "../loading";
import { IPageItem } from "./type";

const Page = (props: IPageItem) => {
	const { page, active, disabled, children, onChange } = props;
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		if (active || loading || disabled) return;

		setLoading(true);
		await onChange?.(page);
		setLoading(false);
	};

	return (
		<a
			className={classNames("i-page", {
				"i-page-active": active,
				"i-page-loading": loading,
				"i-page-disabled": disabled,
			})}
			data-page={page}
			onClick={handleClick}
		>
			{loading && <Loading absolute />}
			{children}
		</a>
	);
};

export default Page;
