import React from 'react'
export default function MockLink({ children, href, ...props }: any) {
  return <a href={href} {...props}>{children}</a>
}
