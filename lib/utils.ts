import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let cachedZZZVersion: string | null = null

export async function getZZZVersion(): Promise<string> {
  if (cachedZZZVersion) {
    return cachedZZZVersion
  }

  try {
    const response = await fetch('https://static.nanoka.cc/manifest.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    console.log('Manifest response:', data)

    // Extract ZZZ live version from manifest
    cachedZZZVersion = data.zzz?.live

    if (!cachedZZZVersion) {
      throw new Error(`ZZZ version not found in manifest. Full response: ${JSON.stringify(data)}`)
    }
    console.log('ZZZ version:', cachedZZZVersion)
    return cachedZZZVersion
  } catch (error) {
    console.error('Failed to fetch ZZZ version:', error)
    throw error
  }
}

export function getStaticNanokaURL(path: string, version?: string): string {
  if (version) {
    return `https://static.nanoka.cc/zzz/${version}/${path}`
  }
  return `https://static.nanoka.cc/zzz/${path}`
}

export function getAssetURL(path: string): string {
  return `https://static.nanoka.cc/assets/zzz/${path}`
}
