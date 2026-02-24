"use client";
import PivotWrapper from './PivotWrapper';

export default function PivotClient({ data }: { data: any[] }) {
    return (
        <div className="w-full">
            <PivotWrapper data={data} />
        </div>
    );
}