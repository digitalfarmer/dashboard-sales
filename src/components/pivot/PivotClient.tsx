"use client";
import PivotWrapper from './PivotWrapper';

export default function PivotClient({ data }: { data: any[] }) {
    return (
        <div className="w-full dark:bg-slate-900">
            <PivotWrapper data={data} />
        </div>
    );
}