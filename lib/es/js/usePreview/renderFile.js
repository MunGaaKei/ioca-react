import { jsxs, jsx } from 'react/jsx-runtime';
import Icon from '../../components/icon/icon.js';
import Video from '../../components/video/video.js';
import { FeedOutlined } from '@ricons/material';
import { TFileType } from './type.js';

function renderFile(props) {
    const { name, suffix, type } = props;
    switch (type) {
        case TFileType.IMAGE:
            return jsx("img", { src: props.src });
        case TFileType.VIDEO:
            return jsx(Video, { ...props });
        default:
            return (jsxs("div", { className: 'i-preview-unknown', children: [jsx(Icon, { icon: jsx(FeedOutlined, {}), size: '3em' }), jsx("h5", { className: 'mt-4', children: name || suffix || "?" })] }));
    }
}

export { renderFile as default };
//# sourceMappingURL=renderFile.js.map
