'use client'
import {Typography} from "antd";
import {useState} from "react";

export default function Description({stay}: { stay: any }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="py-4 border-t border-b border-gray-500">
            <Typography.Paragraph ellipsis={{
                rows: 3,
                expandable: 'collapsible',
                expanded,
                onExpand: (_, info) => setExpanded(info.expanded)
            }}>
                {stay.description}
            </Typography.Paragraph>
            {/*<p className="max-lg:line-clamp-5">{stay.description}</p>*/}
        </div>
    );
}
