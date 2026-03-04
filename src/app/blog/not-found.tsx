import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, FileText } from 'lucide-react'

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 text-muted-foreground" />
              <h1 className="text-3xl font-bold">Blog Not Found</h1>
              <p className="text-muted-foreground text-lg">
                The blog section you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link href="/">
                <Button className="mt-4">
                  Go to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
