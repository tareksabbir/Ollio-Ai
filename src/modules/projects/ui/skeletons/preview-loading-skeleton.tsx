import React from 'react'

const PreviewLoadingSkeleton = () => {
  return (
    <div className="h-full w-full bg-background overflow-auto">
      {/* Header/Navbar */}
      <div className="w-full border-b border-border animate-pulse">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="flex gap-6">
            <div className="h-6 w-16 bg-muted rounded"></div>
            <div className="h-6 w-16 bg-muted rounded"></div>
            <div className="h-6 w-16 bg-muted rounded"></div>
            <div className="h-6 w-20 bg-muted rounded"></div>
          </div>
          <div className="h-10 w-24 bg-muted rounded-lg"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 animate-pulse">
        <div className="text-center space-y-6">
          <div className="h-12 w-3/4 mx-auto bg-muted rounded"></div>
          <div className="h-12 w-2/3 mx-auto bg-muted rounded"></div>
          <div className="h-6 w-1/2 mx-auto bg-muted/60 rounded mt-6"></div>
          <div className="h-6 w-2/5 mx-auto bg-muted/60 rounded"></div>
          
          <div className="flex gap-4 justify-center mt-8">
            <div className="h-12 w-36 bg-muted rounded-lg"></div>
            <div className="h-12 w-36 bg-muted/60 rounded-lg"></div>
          </div>
        </div>

        {/* Hero Image/Mockup */}
        <div className="mt-16 w-full h-96 bg-muted rounded-xl"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 animate-pulse">
        <div className="text-center space-y-4 mb-12">
          <div className="h-10 w-64 mx-auto bg-muted rounded"></div>
          <div className="h-6 w-96 mx-auto bg-muted/60 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="space-y-4">
            <div className="h-12 w-12 bg-muted rounded-lg"></div>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/60 rounded"></div>
              <div className="h-4 w-5/6 bg-muted/60 rounded"></div>
              <div className="h-4 w-4/6 bg-muted/60 rounded"></div>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="space-y-4">
            <div className="h-12 w-12 bg-muted rounded-lg"></div>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/60 rounded"></div>
              <div className="h-4 w-5/6 bg-muted/60 rounded"></div>
              <div className="h-4 w-4/6 bg-muted/60 rounded"></div>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="space-y-4">
            <div className="h-12 w-12 bg-muted rounded-lg"></div>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/60 rounded"></div>
              <div className="h-4 w-5/6 bg-muted/60 rounded"></div>
              <div className="h-4 w-4/6 bg-muted/60 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with Image */}
      <div className="max-w-7xl mx-auto px-6 py-16 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="w-full h-80 bg-muted rounded-xl"></div>
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted/60 rounded"></div>
              <div className="h-4 w-full bg-muted/60 rounded"></div>
              <div className="h-4 w-5/6 bg-muted/60 rounded"></div>
              <div className="h-4 w-4/6 bg-muted/60 rounded"></div>
            </div>
            <div className="h-12 w-40 bg-muted rounded-lg mt-6"></div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-muted/20 py-16 animate-pulse">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <div className="h-10 w-64 mx-auto bg-muted rounded"></div>
            <div className="h-6 w-96 mx-auto bg-muted/60 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-background p-6 rounded-xl space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-5/6 bg-muted rounded"></div>
                <div className="h-4 w-4/6 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted/60 rounded"></div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-background p-6 rounded-xl space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-5/6 bg-muted rounded"></div>
                <div className="h-4 w-4/6 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted/60 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 animate-pulse">
        <div className="bg-muted/20 rounded-2xl p-12 text-center space-y-6">
          <div className="h-10 w-2/3 mx-auto bg-muted rounded"></div>
          <div className="h-6 w-1/2 mx-auto bg-muted/60 rounded"></div>
          <div className="flex gap-4 justify-center mt-8">
            <div className="h-12 w-40 bg-muted rounded-lg"></div>
            <div className="h-12 w-40 bg-muted/60 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-16 animate-pulse">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="h-8 w-32 bg-muted rounded"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted/60 rounded"></div>
                <div className="h-4 w-5/6 bg-muted/60 rounded"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-5 w-24 bg-muted rounded"></div>
              <div className="h-4 w-20 bg-muted/60 rounded"></div>
              <div className="h-4 w-20 bg-muted/60 rounded"></div>
              <div className="h-4 w-20 bg-muted/60 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-5 w-24 bg-muted rounded"></div>
              <div className="h-4 w-20 bg-muted/60 rounded"></div>
              <div className="h-4 w-20 bg-muted/60 rounded"></div>
              <div className="h-4 w-20 bg-muted/60 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-5 w-24 bg-muted rounded"></div>
              <div className="h-4 w-20 bg-muted/60 rounded"></div>
              <div className="h-4 w-20 bg-muted/60 rounded"></div>
              <div className="h-4 w-20 bg-muted/60 rounded"></div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex justify-between">
            <div className="h-4 w-48 bg-muted/60 rounded"></div>
            <div className="flex gap-4">
              <div className="h-6 w-6 rounded-full bg-muted"></div>
              <div className="h-6 w-6 rounded-full bg-muted"></div>
              <div className="h-6 w-6 rounded-full bg-muted"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewLoadingSkeleton