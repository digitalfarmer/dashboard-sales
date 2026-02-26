"use client";
import React, { useEffect, useRef } from 'react';

export default function PivotWrapper({ data }: { data: any[] }) {
    const pivotRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initPivot = () => {
            if (!containerRef.current) return;
            
            if (pivotRef.current) {
                try {
                    pivotRef.current.dispose();
                } catch (e) {}
            }

            if ((window as any).WebDataRocks) {
                pivotRef.current = new (window as any).WebDataRocks({
                    container: containerRef.current,
                    toolbar: true,
                    width: "100%",
                    height: 600,
                    report: {
                        dataSource: { data },
                        slice: {
                            rows: [
                                { uniqueName: "nama_cabang", caption: "Cabang" },
                                { uniqueName: "kode_principal", caption: "Principal" }
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
            } else {
                setTimeout(initPivot, 100);
            }
        };

        initPivot();

        return () => {
            if (pivotRef.current) {
                try {
                    pivotRef.current.dispose();
                } catch (e) {}
            }
        };
    }, [data]);

    return <div ref={containerRef} style={{ minHeight: '600px' }}></div>;
}