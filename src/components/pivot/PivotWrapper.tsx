"use client";
import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function PivotWrapper({ data }: { data: any[] }) {
    const pivotRef = useRef<any>(null);

    const onScriptLoad = () => {
        // @ts-ignore
        new WebDataRocks({
            container: "#wdr-component",
            toolbar: true,
            width: "100%",
            height: 600,
            report: {
                dataSource: { data: data },
                // Di dalam slice report PivotWrapper.tsx
                slice: {
                    rows: [
                        { uniqueName: "nama_cabang", caption: "Cabang" },
                        { uniqueName: "kode_principal", caption: "Principal" } // Update ini
                    ],
                    columns: [
                        { uniqueName: "fkmonth", caption: "Bulan" }
                    ],
                    measures: [
                        { uniqueName: "total_netto", aggregation: "sum", caption: "Total Netto" }
                    ]
                }
            }
        });
    };

    return (
        <>
            {/* Load CSS dari CDN */}
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdn.webdatarocks.com/latest/webdatarocks.min.css"
            />
            {/* Load Script dari CDN */}
            <Script
                src="https://cdn.webdatarocks.com/latest/webdatarocks.toolbar.min.js"
            />
            <Script
                src="https://cdn.webdatarocks.com/latest/webdatarocks.js"
                onLoad={onScriptLoad}
            />

            <div id="wdr-component"></div>
        </>
    );
}