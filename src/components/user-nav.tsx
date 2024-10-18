import { userInfo } from "os";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"


import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectWalletDialog } from "./wallet-connect-dialog";
import Identicon from "./identicon";


export function UserNav() {

  const { chain, isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  const signOut = async () => {
    try {
      await disconnect()
    } catch (error) {
    }
  }
  return (
    isConnected ?
      <DropdownMenu>
        < DropdownMenuTrigger asChild >
          <Button variant="ghost" className="relative h-8 w-8 rounded-lg">
            <Avatar className="h-8 w-8">
              <Identicon address={address as string} />
              {/* <AvatarImage src={"/"} alt="profile" /> */}
              <AvatarFallback />
            </Avatar>
          </Button>
        </DropdownMenuTrigger >
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none"></p>
              <p className="text-xs leading-none text-muted-foreground">
                {chain?.name}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu >
      :
      <ConnectWalletDialog />
  )
}
