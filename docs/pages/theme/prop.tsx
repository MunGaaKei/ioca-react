import { Button, Icon, useTheme } from "@p";
import { LightModeTwotone, NightlightTwotone } from "@ricons/material";

export const DBasic = {
	demo: () => {
		const { theme, setTheme } = useTheme({ listenStorageChange: true });

		return (
			<Button.Toggle
				square
				flat
				after={<Icon icon={<NightlightTwotone />} />}
				active={theme === "theme-dark"}
				onToggle={(v) => setTheme(v ? "theme-dark" : "theme-none")}
			>
				<Icon icon={<LightModeTwotone />} />
			</Button.Toggle>
		);
	},
	code: `const { theme, setTheme } = useTheme({ listenStorageChange: true });

return (
    <Button.Toggle
        square
        flat
        after={<Icon icon={<NightlightTwotone />} />}
        active={theme === "theme-dark"}
        onToggle={(v) => setTheme(v ? "theme-dark" : "theme-none")}
    >
        <Icon icon={<LightModeTwotone />} />
    </Button.Toggle>
);`,
	lang: "javascript",
};

export const PTheme = [
	{
		name: "key",
		desc: "localStorage中的键名",
		type: ["string"],
		def: "'ioca-react-theme'",
	},
	{
		name: "listenStorageChange",
		desc: "是否监听localStorage变化",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "defaultValue",
		desc: "当前主题",
		type: ["string"],
	},
];
