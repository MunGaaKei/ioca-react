import "react";

declare module "react" {
	interface SVGProps<T> extends React.DOMAttributes<T> {
		// 添加缺少的属性
		onPointerEnterCapture?: (e: React.PointerEvent<SVGSVGElement>) => void;
		onPointerLeaveCapture?: (e: React.PointerEvent<SVGSVGElement>) => void;
	}
}
