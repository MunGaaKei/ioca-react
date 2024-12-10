import classNames from "classnames";
import { useState } from "react";
import Loading from "../loading";
import { IPageItem } from "./type";

const Page = (props: IPageItem) => {
	const { page, active, children, onChange } = props;
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		if (active || loading) return;

		setLoading(true);
		await onChange?.(page);
		setLoading(false);
	};

	return (
		<a
			className={classNames("i-page", {
				"i-page-active": active,
				"i-page-loading": loading,
				"i-page-disabled": false,
			})}
			data-page={page}
			onClick={handleClick}
		>
			{loading && <Loading />}
			{children}
		</a>
	);
};

export default Page;
