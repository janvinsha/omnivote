import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { FilterSelector, FilterSkeleton } from "./filter-selector"

export function CardList({ list, useFilter }: { list: any, useFilter: any }) {
    return (
        <div
            className="rounded-lg shadow-sm ring-1 ring-border"
        >
            <div className="flex items-center p-2 pb-0">
                <div className="flex-1 pl-1 text-lg font-medium py-4">
                    <h2 className="capitalize">{list?.name}</h2>
                </div>
                <React.Suspense fallback={<FilterSkeleton />}>
                    {/* <FilterSelector
                        className="ml-auto"
                    /> */}
                </React.Suspense>
            </div>
            <div className="flex flex-col gap-1 p-2 sm:flex-row sm:gap-2">
                {list?.items?.map((item) => (
                    <Card key={item.id}>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
