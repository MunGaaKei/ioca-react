import{jsx as e}from"react/jsx-runtime";import t from"classnames";function i(i){const{items:r=[],active:m,renderItem:c,unit:n,onClick:a}=i;return r.map((i=>{const r=i===m;return e("a",{className:t("i-timepicker-item",{"i-timepicker-item-active":r}),onClick:()=>a(i),children:c?.(i,r,n)??(i<10?`0${i}`:i)},i)}))}export{i as default};
//# sourceMappingURL=item.js.map
