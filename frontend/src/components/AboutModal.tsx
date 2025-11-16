import { SeoContent } from './SeoContent'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function AboutModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm text-muted-foreground p-0 h-auto">
          Learn more about font subsetting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">About Font Subsetting</DialogTitle>
          <DialogDescription>
            Everything you need to know about optimizing fonts for the web
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <SeoContent />
        </div>
      </DialogContent>
    </Dialog>
  )
}
