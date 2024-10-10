import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { FilterSelector, FilterSkeleton } from "./filter-selector"
import { getChainImage } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "./ui/skeleton";
const imageUrl = "https://ipfs.io/ipfs/QmUUshcrtd7Fj4nMmYB3oYRDXcswpB2gw7ECmokcRqcNMf";

export function CardList({ list, useFilter, navRightComponent, loading }: { list: any, useFilter?: any, navRightComponent?: any, loading: boolean }) {
    return (
        <div className="rounded-lg shadow-sm ring-1 ring-border">
            <div className="flex items-center p-2 pb-0">
                <div className="flex-1 pl-4 text-lg font-medium py-4">
                    <h2 className="capitalize">{list?.name}</h2>
                </div>
                {navRightComponent ? (
                    <React.Suspense fallback={<FilterSkeleton />}>
                        {navRightComponent}
                    </React.Suspense>
                ) : (
                    <React.Suspense fallback={<FilterSkeleton />}>
                        {/* <FilterSelector className="ml-auto" /> */}
                    </React.Suspense>
                )}
            </div>
            {loading ?
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4">
                    <Skeleton className="w-full min-w-[25%] rounded-lg h-[18rem]" />
                    <Skeleton className="w-full min-w-[25%] rounded-lg h-[18rem]" />
                    <Skeleton className="w-full min-w-[25%] rounded-lg h-[18rem]" />
                    <Skeleton className="w-full min-w-[25%] rounded-lg h-[18rem]" />
                    <Skeleton className="w-full min-w-[25%] rounded-lg h-[18rem]" />
                    <Skeleton className="w-full min-w-[25%] rounded-lg h-[18rem]" />
                    <Skeleton className="w-full min-w-[25%] rounded-lg h-[18rem]" />
                    <Skeleton className="w-full min-w-[25%] rounded-lg h-[18rem]" />
                </div> : <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4">
                    {list?.items?.map((item: any) => (
                        <div key={item.id} className="w-full min-w-[25%] border ring-1 ring-border rounded-lg shadow-sm overflow-hidden">
                            <div className="text-center relative">
                                {item?.endTime as number < Date.now() &&
                                    <Badge variant="destructive" className="absolute right-2 top-2">expired</Badge>
                                }
                                <img
                                    src={item.image || imageUrl}
                                    alt={item.name}
                                    className="w-full h-[16rem] object-cover"
                                />
                            </div>
                            <div className="flex p-4 flex-col">

                                <span className="flex items-center gap-2 truncate">
                                    <img
                                        src={getChainImage(item.mainChain)}
                                        alt={`${item.name} Chain`}
                                        className="w-8 h-8 object-cover rounded-full"
                                    />
                                    <span className="flex flex-col">
                                        <h2 className="transition-colors hover:text-foreground/80">
                                            <Link
                                                href={`/${list.type}/${item._id}`}
                                            >{item.name}</Link>

                                        </h2>
                                        <h2 className="text-sm text-muted-foreground">{item.description}</h2>
                                    </span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div >
    )
}
