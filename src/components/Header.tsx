import { Bell, Search, User, Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-semibold">AU</span>
            </div>
            <span className="text-lg font-semibold">AlumniUnite</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 ml-8">
          <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Network
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Events
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Jobs
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            News
          </a>
        </nav>

        <div className="flex-1 flex items-center justify-end space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alumni, events, jobs..."
              className="pl-10 w-80"
            />
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}