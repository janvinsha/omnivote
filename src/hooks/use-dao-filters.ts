import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"


import { useMounted } from "./use-mounted"

type Config = {
    daoFilter: any
}

const daoAtom = atomWithStorage<Config>("dao", {
    format: "hsl",
})

export function useColors() {
    const [daoFilter, setDaoFilter] = useAtom(daoAtom)
    const mounted = useMounted()

    return {
        isLoading: !mounted,
        daoFilter: daoFilter.format,
        setDaoFilter: (daoFilter: any) => setDaoFilter({ daoFilter }),
    }
}