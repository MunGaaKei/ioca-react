import { CheckRound } from "@ricons/material";
import { useEffect, useState } from "react";
import Button from "../../button";
import Icon from "../../icon";
import Input from "../../input";
import Select from "../../select";

export const ColorMethods = {
    HEX: "toHexString",
    RGB: "toRgbString",
    HSB: "toHsbString",
};

export default function Footer(props) {
    const { value, type, onTypeChange, onChange, onOk } = props;
    const [inputValue, setInputValue] = useState(value);
    const [colorType, setColorType] = useState(type);

    const handleChange = (v: string) => {
        setInputValue(v);
        onChange(v);
    };

    const handleTypeChange = (t: string) => {
        setColorType(t);
        onTypeChange(t);
    };

    useEffect(() => {
        setInputValue(value);
        setColorType(type);
    }, [value, type]);

    return (
        <div className="i-colorpicker-footer">
            <Select
                readOnly
                hideClear
                hideArrow
                style={{ width: "5.6em" }}
                options={["RGB", "HEX", "HSB"]}
                value={colorType}
                onChange={handleTypeChange}
                popupProps={{ fitSize: false }}
            />
            <Input
                placeholder="color"
                value={inputValue}
                onChange={handleChange}
            />
            <Button square onClick={onOk}>
                <Icon icon={<CheckRound />} />
            </Button>
        </div>
    );
}
