import { HTMLAttributes } from "react";

export interface IRiver extends HTMLAttributes<HTMLDivElement> {
	speed?: number;
	pauseOnHover?: boolean;
}
