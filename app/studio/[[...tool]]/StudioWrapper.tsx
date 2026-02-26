'use client'

import { type ReactNode } from 'react'
import { StyleSheetManager } from 'styled-components'

/**
 * Wraps Sanity Studio with a StyleSheetManager that prevents
 * the `disableTransition` prop (passed internally by Next.js 15+)
 * from being forwarded to DOM elements by styled-components.
 */
function shouldForwardProp(prop: string) {
    return prop !== 'disableTransition'
}

export default function StudioWrapper({ children }: { children: ReactNode }) {
    return (
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            {children}
        </StyleSheetManager>
    )
}
