export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function validateUrl(url: string): void {
  if (!url || !url.trim()) {
    throw new ValidationError('URL is required')
  }

  const trimmedUrl = url.trim()

  if (!trimmedUrl.match(/^https?:\/\//)) {
    throw new ValidationError('URL must start with http:// or https://')
  }

  const urlPattern = /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
  if (!urlPattern.test(trimmedUrl)) {
    throw new ValidationError('Please enter a valid URL (e.g., https://example.com)')
  }

  try {
    new URL(trimmedUrl)
  } catch {
    throw new ValidationError('Invalid URL format')
  }
}

export function validateTitle(title: string): void {
  if (!title || !title.trim()) {
    throw new ValidationError('Title is required')
  }

  if (title.trim().length > 200) {
    throw new ValidationError('Title must be less than 200 characters')
  }
}
