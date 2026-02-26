"use client";
import PivotWrapper from './PivotWrapper';

export default function PivotClient({ data, dataKey }: { data: any[], dataKey: string }) {
    return (
        <div className="w-full dark:bg-slate-900">
            <PivotWrapper key={dataKey} data={data} />
        </div>
    );
}