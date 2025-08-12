'use client'

interface PageProps {
  params: Promise<{
    templateName: string
  }>
}

export default async function TemplatePreviewPage({ params }: PageProps) {
  const { templateName } = await params

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Template Preview</h1>
        <h2 className="text-2xl text-muted-foreground capitalize">
          {templateName.replace('-', ' ')}
        </h2>
        <div className="max-w-2xl mx-auto p-8 border rounded-lg bg-card">
          <p className="text-muted-foreground mb-4">
            This is a preview of the {templateName.replace('-', ' ')} template.
          </p>
          <p className="text-sm text-muted-foreground">
            In a full implementation, this would show the actual template preview or iframe.
          </p>
          <div className="mt-6 p-4 bg-muted rounded border-2 border-dashed">
            <p className="font-mono text-sm">Template: {templateName}</p>
            <p className="font-mono text-sm text-muted-foreground">Status: Preview Ready</p>
          </div>
        </div>
      </div>
    </div>
  )
}