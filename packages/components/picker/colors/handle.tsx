import classNames from "classnames";

const Handle = (props) => {
	const { ref, color, handle, placeholder, className, ...restProps } = props;

	return (
		<div
			ref={ref}
			className={classNames("i-colorpicker-handle", className)}
			{...restProps}
		>
			{handle !== "text" && (
				<i
					className='i-colorpicker-square'
					style={{ background: color }}
				/>
			)}

			{handle !== "square" && (
				<span className='i-colorpicker-text' style={{ color }}>
					{color ?? placeholder}
				</span>
			)}
		</div>
	);
};

export default Handle;
