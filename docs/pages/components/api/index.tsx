import { Flex, Popup } from "@p";
import classNames from "classnames";
import { Fragment, ReactNode } from "react";

export default function Api(props) {
	const { apis = [], className } = props;

	return (
		<div className={classNames("apis", className)}>
			{apis.map((o) => {
				const { name, type, def, desc, required, event, exp } = o;

				return (
					<div key={name}>
						<Flex align='baseline' gap={8} wrap>
							<Popup
								disabled={!exp}
								className='bg-warning'
								content={
									<div className='pd-8'>
										实验性功能，暂不推荐使用
									</div>
								}
							>
								<h5
									className={classNames({
										green: event,
										warning: exp,
									})}
								>
									{name}
								</h5>
							</Popup>

							{required && <span className='red'>⁕</span>}

							{def !== undefined && (
								<code className='bg-pink-0'>{def}</code>
							)}

							<Flex gap={4} wrap>
								{type.map((t: ReactNode, i: number) => {
									return (
										<Fragment key={i}>
											{i === 0 ? null : (
												<span className='color-8'>
													|
												</span>
											)}
											<span className='px-4 round-slight color-6'>
												{t}
											</span>
										</Fragment>
									);
								})}
							</Flex>
						</Flex>
						<p className='mt-8 color-5 font-sm'>{desc}</p>
					</div>
				);
			})}
		</div>
	);
}
